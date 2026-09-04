import { verifyAccessToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest){
    const accessToken = req.cookies.get("accessToken")?.value;
    if(accessToken){
        try{
            verifyAccessToken(accessToken);
        }
        catch{
            const hasRefreshToken = req.cookies.has("refreshToken");
            if(hasRefreshToken){
                const refreshURL = new URL("/api/auth/refresh", req.url);
                refreshURL.searchParams.set("redirect", req.nextUrl.pathname);
                return NextResponse.redirect(refreshURL);
            }
            return NextResponse.redirect(new URL("/signin", req.url));
        }
        return NextResponse.next();
    }
    else{
        const hasRefreshToken = req.cookies.has("refreshToken");
        if(hasRefreshToken){
            const refreshURL = new URL("/api/auth/refresh", req.url);
            refreshURL.searchParams.set("redirect", req.nextUrl.pathname);
            return NextResponse.redirect(refreshURL);
        }
        return NextResponse.redirect(new URL("/signin", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*"]
}
