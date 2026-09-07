'use client';

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import InputBox from "@/components/InputBox";
import SubHeading from "@/components/SubHeading";
import { TransferOutputType, transferUISchema,  TransferInputType } from "@/lib/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function TransferForm(){
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {errors}
    } = useForm<TransferInputType, unknown, TransferOutputType>({
        resolver: zodResolver(transferUISchema)
    });

    const router = useRouter();

    const [idempotencyKey, setIdempotencyKey] = useState(()=>crypto.randomUUID());
    const [formError, setFormError] = useState<string | null>(null);
    const recipientMail = watch("recipientMail");
    const amount = watch("amount");
    
    useEffect(() => {
        setFormError(null);
    }, [recipientMail, amount]);

    const onSubmit = async (data: TransferOutputType)=>{
        setFormError(null);

        const res = await fetch('/api/wallet/transfer', {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Idempotency-Key":idempotencyKey
            },
            credentials: "include",
            body: JSON.stringify({recipientMail:data.recipientMail, amount: data.amount})
        });

        if(!res.ok){
            const {error} = await res.json();
            setFormError(error);
            return;
        }

        setIdempotencyKey(crypto.randomUUID());
        reset();
        router.push("/dashboard");
    };

return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Heading title="Transfer Money" />
            <SubHeading subheading="Send money to another Ledgerline user"/>
            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <InputBox
            label="Recipient Email"
            id="recipientMail"
            error={errors.recipientMail?.message}
            type="email"
            placeholder="Enter recipient's email"
            {...register("recipientMail")} />
            <InputBox
            label="Amount"
            id="amount"
            step="0.01"
            error={errors.amount?.message}
            type="number"
            placeholder="Enter amount"
            {...register("amount")} />
            <Button buttonText="Transfer"/>
        </form>
    )
}