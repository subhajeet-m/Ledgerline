import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";

export async function getSession(){
    const accessToken = (await cookies()).get("accessToken")?.value;
    if(!accessToken)
        return null;

    try{
        return verifyAccessToken(accessToken) as {userId: number};
    }
    catch{
        return null;
    }
}