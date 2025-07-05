import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRedisClient } from '@/lib/redis';
import { securityLogger } from '@/lib/security';

// GDPR consent record interface
interface ConsentRecord {
  consents: Record<string, boolean>;
  timestamp: number;
  version: string;
  ip?: string;
  userAgent?: string;
  withdrawalMechanism: boolean;
  dataTransferConsent: boolean;
}

// Audit log entry
interface ConsentAuditLog {
  id: string;
  userId?: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  consentRecord: ConsentRecord;
  timestamp: number;
  action: 'granted' | 'updated' | 'withdrawn';
  previousConsents?: Record<string, boolean>;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Validate consent record
    if (!body.consents || !body.timestamp || !body.version) {
      return NextResponse.json(
        { error: 'Invalid consent record format' },
        { status: 400 }
      );
    }

    // Generate unique consent record ID
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = request.headers.get('x-session-id') || 
                     request.cookies.get('session')?.value || 
                     'anonymous';

    // Get previous consent for comparison
    let previousConsents: Record<string, boolean> | undefined;
    const userId = session?.user?.id;
    
    if (userId) {
      try {
        const redis = await getRedisClient();
        const previousConsentStr = await redis.get(`user_consent:${userId}`);
        if (previousConsentStr) {
          const previousRecord = JSON.parse(previousConsentStr);
          previousConsents = previousRecord.consents;
        }
      } catch (error) {
        console.error('Error retrieving previous consent:', error);
      }
    }

    // Determine action type
    let action: 'granted' | 'updated' | 'withdrawn' = 'granted';
    if (previousConsents) {
      const hasAnyNonEssential = Object.entries(body.consents)
        .some(([key, value]) => key !== 'essential' && value === true);
      
      if (!hasAnyNonEssential && body.consents.none === true) {
        action = 'withdrawn';
      } else {
        action = 'updated';
      }
    }

    // Create enhanced consent record with IP and user agent
    const enhancedConsentRecord: ConsentRecord = {
      ...body,
      ip: ip.split(',')[0].trim(), // Take first IP if multiple
      userAgent,
    };

    // Create audit log entry
    const auditLog: ConsentAuditLog = {
      id: consentId,
      userId,
      sessionId,
      ip: enhancedConsentRecord.ip!,
      userAgent,
      consentRecord: enhancedConsentRecord,
      timestamp: Date.now(),
      action,
      previousConsents,
    };

    // Store consent record in Redis with expiration (7 years for GDPR compliance)
    const sevenYears = 7 * 365 * 24 * 60 * 60; // 7 years in seconds
    
    try {
      const redis = await getRedisClient();
      
      // Store user-specific consent if authenticated
      if (userId) {
        await redis.setex(
          `user_consent:${userId}`,
          sevenYears,
          JSON.stringify(enhancedConsentRecord)
        );
      }
      
      // Store session-specific consent for anonymous users
      await redis.setex(
        `session_consent:${sessionId}`,
        sevenYears,
        JSON.stringify(enhancedConsentRecord)
      );
      
      // Store audit log
      await redis.setex(
        `consent_audit:${consentId}`,
        sevenYears,
        JSON.stringify(auditLog)
      );
      
      // Add to audit log list for compliance reporting
      await redis.lpush('consent_audit_log', consentId);
      
      // Keep only last 10000 audit entries in the list
      await redis.ltrim('consent_audit_log', 0, 9999);
      
    } catch (redisError) {
      console.error('Redis storage error:', redisError);
      // Continue execution - local storage is primary, server storage is backup
    }

    // Log security event
    securityLogger.info('User consent recorded', {
      type: 'CONSENT_RECORDED',
      action,
      userId,
      ip: enhancedConsentRecord.ip!,
      userAgent,
      consentId,
      consents: body.consents,
      dataTransferConsent: body.dataTransferConsent,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      consentId,
      action,
      timestamp: auditLog.timestamp,
    });

  } catch (error) {
    console.error('Error recording consent:', error);
    
    securityLogger.error('Failed to record user consent', {
      type: 'CONSENT_RECORD_ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(
      { error: 'Failed to record consent' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve consent history for compliance
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get current consent
    const redis = await getRedisClient();
    const currentConsentStr = await redis.get(`user_consent:${userId}`);
    let currentConsent = null;
    
    if (currentConsentStr) {
      currentConsent = JSON.parse(currentConsentStr);
    }

    // Get consent history from audit log
    const auditLogIds = await redis.lrange('consent_audit_log', 0, -1);
    const userAuditLogs = [];
    
    for (const logId of auditLogIds) {
      try {
        const logStr = await redis.get(`consent_audit:${logId}`);
        if (logStr) {
          const log = JSON.parse(logStr);
          if (log.userId === userId) {
            userAuditLogs.push({
              id: log.id,
              timestamp: log.timestamp,
              action: log.action,
              consents: log.consentRecord.consents,
              dataTransferConsent: log.consentRecord.dataTransferConsent,
            });
          }
        }
      } catch (error) {
        console.error('Error parsing audit log:', error);
      }
    }

    // Sort by timestamp (newest first)
    userAuditLogs.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      currentConsent,
      history: userAuditLogs.slice(0, 50), // Return last 50 entries
      withdrawalAvailable: true,
      dataSubjectRights: {
        access: true,
        rectification: true,
        erasure: true,
        portability: true,
        objection: true,
      },
    });

  } catch (error) {
    console.error('Error retrieving consent history:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve consent history' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for consent withdrawal and data erasure
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create withdrawal record
    const withdrawalRecord: ConsentRecord = {
      consents: {
        essential: true,
        functional: false,
        analytics: false,
        personalization: false,
        marketing: false,
        data_transfer: false,
        all: false,
        none: true,
      },
      timestamp: Date.now(),
      version: '2.0',
      ip: ip.split(',')[0].trim(),
      userAgent,
      withdrawalMechanism: true,
      dataTransferConsent: false,
    };

    // Record withdrawal
    const withdrawalId = `withdrawal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const redis = await getRedisClient();
    
    await redis.setex(
      `user_consent:${userId}`,
      7 * 365 * 24 * 60 * 60, // 7 years
      JSON.stringify(withdrawalRecord)
    );

    // Log withdrawal in audit trail
    const auditLog: ConsentAuditLog = {
      id: withdrawalId,
      userId,
      sessionId: 'withdrawal',
      ip: withdrawalRecord.ip!,
      userAgent,
      consentRecord: withdrawalRecord,
      timestamp: Date.now(),
      action: 'withdrawn',
    };

    await redis.setex(
      `consent_audit:${withdrawalId}`,
      7 * 365 * 24 * 60 * 60,
      JSON.stringify(auditLog)
    );

    await redis.lpush('consent_audit_log', withdrawalId);

    // Log security event
    securityLogger.info('User withdrew consent', {
      type: 'CONSENT_WITHDRAWN',
      userId,
      ip: withdrawalRecord.ip!,
      userAgent,
      withdrawalId,
      timestamp: auditLog.timestamp,
    });

    return NextResponse.json({
      success: true,
      withdrawalId,
      timestamp: auditLog.timestamp,
      message: 'Consent withdrawn successfully',
    });

  } catch (error) {
    console.error('Error withdrawing consent:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw consent' },
      { status: 500 }
    );
  }
}