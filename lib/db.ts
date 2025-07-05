import { PrismaClient } from '@prisma/client';

// Create a mock PrismaClient for build process
class MockPrismaClient {
  constructor() {
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop === 'then') {
          return undefined;
        }
        return {
          findUnique: async () => ({}),
          findMany: async () => [],
          findFirst: async () => ({}),
          create: async (data: any) => data.data,
          createMany: async () => ({ count: 0 }),
          update: async (data: any) => data.data,
          updateMany: async () => ({ count: 0 }),
          upsert: async (data: any) => data.create,
          delete: async () => ({}),
          deleteMany: async () => ({ count: 0 }),
          count: async () => 0,
          aggregate: async () => ({}),
          groupBy: async () => ({}),
        };
      },
    });
  }
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient | any };

// Use mock client during build process
const isBuildProcess = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

export const prisma =
  globalForPrisma.prisma ||
  (isBuildProcess
    ? (new MockPrismaClient() as unknown as PrismaClient)
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;