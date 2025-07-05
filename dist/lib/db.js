"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
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
                    create: async (data) => data.data,
                    createMany: async () => ({ count: 0 }),
                    update: async (data) => data.data,
                    updateMany: async () => ({ count: 0 }),
                    upsert: async (data) => data.create,
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
const globalForPrisma = global;
// Use mock client during build process
const isBuildProcess = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
exports.prisma = globalForPrisma.prisma ||
    (isBuildProcess
        ? new MockPrismaClient()
        : new client_1.PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        }));
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
exports.default = exports.prisma;
