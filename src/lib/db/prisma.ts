import { PrismaClient } from '@prisma/client';

// PrismaClient는 서버사이드에서만 실행되어야 함
// 클라이언트 사이드에서 실행되지 않도록 처리
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = 
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db; 