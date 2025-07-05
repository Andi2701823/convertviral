// Type declarations for Prisma models

import { PrismaClient } from '@prisma/client';

// Declare global namespace for Prisma JSON types
declare global {
  namespace PrismaJson {
    type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
    interface JsonObject {
      [Key: string]: JsonValue;
    }
    interface JsonArray extends Array<JsonValue> {}
  }
}

// Declare module augmentation for Prisma
declare module '@prisma/client' {
  // Extend the User model
  interface User {
    stripeCustomerId?: string;
    defaultPaymentMethodId?: string;
    subscriptions?: Subscription[];
  }

  interface UserSelect {
    stripeCustomerId?: boolean;
    defaultPaymentMethodId?: boolean;
    subscriptions?: boolean | SubscriptionSelect;
  }

  interface PrismaClient {
    subscription: any;
  }

  interface Subscription {
    id: string;
    userId: string;
    user: User;
    status: string;
    priceId: string;
    quantity: number;
    cancelAtPeriodEnd: boolean;
    cancelAt: Date | null;
    canceledAt: Date | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    createdAt: Date;
    updatedAt: Date;
    stripeSubscriptionId: string;
  }

  interface SubscriptionSelect {
    id?: boolean;
    userId?: boolean;
    user?: boolean | UserSelect;
    status?: boolean;
    priceId?: boolean;
    quantity?: boolean;
    cancelAtPeriodEnd?: boolean;
    cancelAt?: boolean;
    canceledAt?: boolean;
    currentPeriodStart?: boolean;
    currentPeriodEnd?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stripeSubscriptionId?: boolean;
  }
}