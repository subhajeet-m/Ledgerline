import { prisma } from "@/lib/prisma";
import { executeTransfer } from "@/lib/wallet";
import { Decimal } from "@prisma/client/runtime/client";
import { afterEach, beforeEach, expect, it } from "vitest";

// Establishing a brand-new physical connection to Neon takes ~2-3s in this
// environment — well past Prisma's 2s default transaction maxWait. The
// underlying pg.Pool also prunes idle connections after ~10s, so warming
// once at the top of the file (beforeAll) doesn't help — by the time a
// concurrency test runs, the extra warmed connection has already been
// closed by earlier sequential tests leaving it idle. Warming right before
// each concurrency test's real work, with no idle gap in between, is what
// actually keeps the cost out of the timed assertions.
async function warmPool() {
    await Promise.all([
        prisma.$queryRaw`SELECT 1`,
        prisma.$queryRaw`SELECT 1`,
    ]);
}

// Test User Creation and later cleanup
let walletA: {id: number}, walletB: {id: number};
let userIdA: number, userIdB: number;

beforeEach(async ()=>{
    const emailSuffix1 = crypto.randomUUID();
    const email1 = `${emailSuffix1}@gmail.com`;

    const emailSuffix2 = crypto.randomUUID();
    const email2 = `${emailSuffix2}@gmail.com`;

    const user1 = await prisma.user.create({
        data: {
            email: email1,
            password: "Abcd@1234",
            name: "Vite Test User 1",
            wallet: {
                create: {
                    balance: 10000.00,
                }
            }
        },
        include: {
            wallet: true,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: email2,
            password: "Efgh@5678",
            name: "Vite Test User 2",
            wallet: {
                create: {
                    balance: 10000.00,
                }
            }
        },
        include: {
            wallet: true,
        },
    });

    if(user1.wallet && user2.wallet){
        userIdA = user1.id;
        walletA = user1.wallet;

        userIdB = user2.id;
        walletB = user2.wallet;
    }

});

afterEach(async ()=>{
    await prisma.transaction.deleteMany({
        where: {
            OR: [
                {senderWalletId: {in: [walletA.id, walletB.id]}},
                {receiverWalletId: {in: [walletA.id, walletB.id]}},
            ],
        },
    });

    await prisma.wallet.deleteMany({
        where: {
            id: {in: [walletA.id, walletB.id]},
        },
    });

    await prisma.user.deleteMany({
        where: {
            id: {in: [userIdA, userIdB]},
        },
    });
});

// Rejection cases
it("rejects a self-transfer", async ()=>{
    await expect(executeTransfer(walletA.id, walletA.id, new Decimal(10)))
    .rejects.toThrow("Sending to yourself is not allowed");
});
it("rejects a non-positive transfer", async ()=>{
    await expect(executeTransfer(walletA.id, walletB.id, new Decimal(0)))
    .rejects.toThrow("Transfer amount needs to be more than 0");
});

//Insufficient balance
it("rejects transfers exceeding balance", async ()=>{
    const beforeA = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletA.id,
        },
    });

    const beforeB = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletB.id,
        },
    });

    await expect(executeTransfer(walletA.id, walletB.id, new Decimal(999999)))
    .rejects.toThrow("Insufficient balance");

    const afterA = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletA.id,
        },
    });

    const afterB = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletB.id,
        },
    });

    expect(afterA.balance.equals(beforeA.balance)).toBe(true);
    expect(afterB.balance.equals(beforeB.balance)).toBe(true);
});

// Successful transfer
it("moves money and records exactly one transaction", async ()=>{
    const beforeA = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletA.id,
        },
    });

    const beforeB = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletB.id,
        },
    });
    await executeTransfer(walletA.id, walletB.id, new Decimal(100));

    const afterA = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletA.id,
        },
    });

    const afterB = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletB.id,
        },
    });

    expect(afterA.balance.equals(beforeA.balance.minus(100))).toBe(true);
    expect(afterB.balance.equals(beforeB.balance.plus(100))).toBe(true);

    const txs = await prisma.transaction.findMany({
        where: {
            senderWalletId: walletA.id,
            receiverWalletId: walletB.id,
        },
    });

    expect(txs).toHaveLength(1);
    expect(txs[0].amount.equals(new Decimal(100))).toBe(true);
});

// Concurrency check
it("checks bi-directional concurrency during transfers", async ()=>{
    const beforeA = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletA.id,
        },
    });

    const beforeB = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletB.id,
        },
    });

    await warmPool();
    await Promise.all([
        executeTransfer(walletA.id, walletB.id, new Decimal(50)),
        executeTransfer(walletB.id, walletA.id, new Decimal(30)),
    ]);

    const afterA = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletA.id,
        },
    });

    const afterB = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletB.id,
        },
    });

    expect((afterA.balance.plus(afterB.balance)).equals(beforeA.balance.plus(beforeB.balance))).toBe(true);
}, 30000);

it("checks uni-directional concurrency during transfers", async ()=>{
    await warmPool();
    const results = await Promise.allSettled([
        executeTransfer(walletA.id, walletB.id, new Decimal(7000)),
        executeTransfer(walletA.id, walletB.id, new Decimal(7000)),
    ]);

    const fulfilled = results.filter(r=> r.status === "fulfilled");
    const rejected = results.filter(r=> r.status === "rejected");
    const rejectedOne = results.find(r=> r.status === "rejected");

    const afterA = await prisma.wallet.findUniqueOrThrow({
        where: {
            id: walletA.id,
        },
    });

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    if(rejectedOne)
        expect(rejectedOne.reason.message).toBe("Insufficient balance");

    expect(afterA.balance.gte(0)).toBe(true);
}, 30000);