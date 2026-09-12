import { claimIdempotencyKey, releaseIdempotencyKey } from "@/lib/idempotency";
import { prisma } from "@/lib/prisma";
import { transferLimiter } from "@/lib/ratelimit";
import { getSession } from "@/lib/session";
import { transferSchema } from "@/lib/validation/transfer.server.schema";
import { executeTransfer } from "@/lib/wallet";
import { ApiErrorResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(req: NextRequest){
    const idempotencyKey = req.headers.get("Idempotency-key");
    if(!idempotencyKey)
        return NextResponse.json({error: "Missing idempotency-key header"}, {status: 400});

    const session = await getSession();
    if(!session)
        return NextResponse.json({error: "Unauthorized session"}, {status: 401});

    const fail = async (error: string, status: number)=>{
        await releaseIdempotencyKey(`transfer:${session.userId}:${idempotencyKey}`);
        return NextResponse.json({error}, {status});
    }

    const {success} = await transferLimiter.limit(String(session.userId));
    if(!success)
        return await fail("Too many transfer attempts. Please try again after some time", 429);

    const body = await req.json();
    const validation = transferSchema.safeParse(body);
    if(!validation.success){
        const flattenedError = z.flattenError(validation.error);
        return NextResponse.json<ApiErrorResponse>({
            error: "Please enter valid details",
            fieldErrors: flattenedError.fieldErrors
        }, {status: 400});
    }

    const keyClaimed = await claimIdempotencyKey(`transfer:${session.userId}:${idempotencyKey}`);
    if(!keyClaimed)
        return await fail("Duplicate request", 409);

    const recipient = await prisma.user.findUnique({
        where: {
            email:validation.data.recipientMail,
        },
        include: {
            wallet: true,
        },
    });
    if(!recipient || !recipient.wallet)
        return await fail("No account found for this email", 404);
    const sender = await prisma.user.findUnique({
        where: {
            id: session.userId,
        },
        include: {
            wallet: true,
        },
    });
    if(!sender || !sender.wallet)
        return await fail("Wallet doesn't exist for user", 404);
    if(sender.id === recipient.id)
        return await fail("Self transfer is not allowed", 400);

    let transfer;
    try{
        transfer = await executeTransfer(sender.wallet.id, recipient.wallet.id, validation.data.amount);
    }
    catch(err){
        return await fail(err instanceof Error? err.message:"Transfer failed", 400);
    }

    return NextResponse.json({success: transfer}, {status: 200});
}