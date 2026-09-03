import { ReactNode } from "react";

export default function AuthLayout({children}:{children:ReactNode}){
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-300">
            <div className="w-full max-w-sm rounded-md bg-white text-center p-5 shadow-md space-y-3.5">
                {children}
            </div>
        </div>
    )
}