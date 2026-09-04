'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signinSchema, SigninType } from "@/lib/validation/auth.schema";
import Heading from "@/components/Heading";
import SubHeading from "@/components/SubHeading";
import InputBox from "@/components/InputBox";
import Button from "@/components/Button";

export default function SigninForm(){
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<SigninType>({
        resolver: zodResolver(signinSchema)
    });

    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);
    const email = watch("email");
    const password = watch("password");

    useEffect(() => {
        setFormError(null);
    }, [email, password]);

    const onSubmit = async (data: SigninType)=>{
        setFormError(null);

        const res = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include",
            body: JSON.stringify(data)
        });

        if(!res.ok){
            const {error} = await res.json();
            setFormError(error);
            return;
        }

        router.push("/dashboard");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Heading title="Sign In" />
            <SubHeading subheading="Enter your details to log into your account"/>
            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <InputBox
            label="Email"
            id="email"
            error={errors.email?.message}
            type="email"
            placeholder="Enter your email"
            {...register("email")} />
            <InputBox
            label="Password"
            id="password"
            error={errors.password?.message}
            type="password"
            placeholder="Enter your password"
            {...register("password")} />
            <Button buttonText="Sign In"/>
            <p className="text-center text-sm text-gray-400">
                New to Ledgerline?{" "}
                <Link href="/signup" className="font-medium text-black hover:underline">
                    Create your account
                </Link>
            </p>
        </form>
    )
}