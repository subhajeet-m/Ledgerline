import { Prisma } from '@/app/generated/prisma/client';
import { z } from 'zod';

export const transferSchema = z.object({
    recipientMail: z.email(),
    amount: z.union([z.number(), z.string()])
    .transform((val)=>new Prisma.Decimal(val))
});
