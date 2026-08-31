import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export function signAccessToken(payLoad: {userId: number}){
    return jwt.sign(payLoad, process.env.JWT_ACCESS_SECRET!, {expiresIn: "15m"});
}

const REFRESH_TOKEN_TTL_MS = 24*60*60*7*1000;
export function signRefreshToken(payLoad: {userId: number}): {token: string, expiresAt: Date}{
    const token = jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET!, {expiresIn: "7d"});
    const expiresAt = new Date(Date.now()+REFRESH_TOKEN_TTL_MS);
    return {token, expiresAt};
}

export function verifyAccessToken(token: string){
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
}

export function verifyRefreshToken(token: string){
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
}

export function hashRefreshToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}