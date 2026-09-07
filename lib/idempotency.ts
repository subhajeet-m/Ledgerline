import { redis } from "./redis";

export async function claimIdempotencyKey(key: string){
    const result = await redis.set(key, "1", {nx: true, ex: 300});
    return result === "OK"; 
}

export async function releaseIdempotencyKey(key: string){
    await redis.del(key);
}