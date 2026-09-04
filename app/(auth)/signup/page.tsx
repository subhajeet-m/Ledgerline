'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupSchema, SignupType } from "@/lib/validation/auth.schema";
import Heading from "@/components/Heading";
import SubHeading from "@/components/SubHeading";
import InputBox from "@/components/InputBox";
import Button from "@/components/Button";

export default function SignupForm(){
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<SignupType>({
        resolver: zodResolver(signupSchema)
    });

    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);
    const name = watch("name");
    const email = watch("email");
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");
    const [passwordsMismatch, setPasswordsMismatch] = useState(false);

    useEffect(() => {
        setFormError(null);
    }, [name, email, password, confirmPassword]);

    useEffect(() => {
        if (!confirmPassword || password === confirmPassword) {
            setPasswordsMismatch(false);
            return;
        }
        if (password && password.length === confirmPassword.length) {
            setPasswordsMismatch(true);
        }
    }, [password, confirmPassword]);

    const onSubmit = async (data: SignupType)=>{
        setFormError(null);

        const res = await fetch("/api/auth/signup", {
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
        router.push('/dashboard');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Heading title="Sign Up" />
            <SubHeading subheading="Enter your information to create an account" />

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <InputBox
                label="Name"
                id="name"
                error={errors.name?.message}
                placeholder="Daniel Adams"
                {...register("name")}
            />
            <InputBox
                label="Email"
                id="email"
                type="email"
                error={errors.email?.message}
                placeholder="daniel@gmail.com"
                {...register("email")}
            />
            <InputBox
                label="Password"
                id="password"
                type="password"
                error={errors.password?.message}
                placeholder="Daniel@1234"
                {...register("password")}
            />
            {passwordsMismatch && (
                <p className="text-sm text-red-600">Passwords do not match</p>
            )}
            <InputBox
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
            />

            <Button buttonText="Sign Up" />
            <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-black hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    )
}
