import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const signinLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(7, "10 m"),
    prefix: "ratelimit:signin"
});

export const transferLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    prefix: "ratelimit:transfer"
});