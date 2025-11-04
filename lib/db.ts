import { PrismaClient } from '@/app/generated/prisma';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';

const adapter = new PrismaNeonHTTP(process.env.DATABASE_URL!, {});
export const prisma = new PrismaClient({ adapter });
