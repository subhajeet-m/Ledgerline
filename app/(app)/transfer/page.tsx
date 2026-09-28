'use client';

import FormButton from "@/components/FormButton";
import Heading from "@/components/Heading";
import InputBox from "@/components/InputBox";
import SubHeading from "@/components/SubHeading";
import { TransferOutputType, transferUISchema,  TransferInputType } from "@/lib/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ApiErrorResponse } from "@/types";
import { toast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TransferForm(){
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: {errors, isSubmitting}
    } = useForm<TransferInputType, unknown, TransferOutputType>({
        resolver: zodResolver(transferUISchema)
    });

    const router = useRouter();

    const [idempotencyKey, setIdempotencyKey] = useState(()=>crypto.randomUUID());
    const [formError, setFormError] = useState<string | null>(null);
    const [pendingTransfer, setPendingTransfer] = useState<TransferOutputType | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const recipientMail = watch("recipientMail");
    const amount = watch("amount");

    useEffect(() => {
        setFormError(null);
    }, [recipientMail, amount]);

    const onSubmit = (data: TransferOutputType)=>{
        setFormError(null);
        setPendingTransfer(data);
    };

    const confirmTransfer = async ()=>{
        if(!pendingTransfer) return;
        setIsConfirming(true);

        try{
            const res = await fetch('/api/wallet/transfer', {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "Idempotency-Key":idempotencyKey
                },
                credentials: "include",
                body: JSON.stringify({recipientMail:pendingTransfer.recipientMail, amount: pendingTransfer.amount})
            });

            if(!res.ok){
                const body: ApiErrorResponse = await res.json();
                if(body.fieldErrors){
                    Object.entries(body.fieldErrors).forEach(([field, messages])=>{
                        setError(field as keyof TransferInputType, {
                            type: "server",
                            message: messages[0]
                        });
                    });
                }
                setPendingTransfer(null);
                setFormError(body.error);
                return;
            }

            toast.add({title: "Transfer successful", type: "success"});
            setPendingTransfer(null);
            setIdempotencyKey(crypto.randomUUID());
            reset();
            router.push("/dashboard");
        } finally {
            setIsConfirming(false);
        }
    };

return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Heading title="Transfer Money" />
            <SubHeading subheading="Send money to another Ledgerline user"/>
            {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}

            <InputBox
            label="Recipient Email"
            id="recipientMail"
            error={errors.recipientMail?.message}
            type="email"
            placeholder="Enter recipient's email"
            disabled={isSubmitting}
            {...register("recipientMail")} />
            <InputBox
            label="Amount"
            id="amount"
            step="0.01"
            error={errors.amount?.message}
            type="number"
            placeholder="Enter amount"
            disabled={isSubmitting}
            {...register("amount")} />
            <FormButton buttonText="Transfer" disabled={isSubmitting}/>
        </form>

        <AlertDialog open={pendingTransfer !== null} onOpenChange={(open)=>{ if(!open && !isConfirming) setPendingTransfer(null); }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm transfer</AlertDialogTitle>
                    <AlertDialogDescription>
                        {pendingTransfer && (
                            <>Send <strong>{formatINR(pendingTransfer.amount)}</strong> to <strong>{pendingTransfer.recipientMail}</strong>? This can&apos;t be undone.</>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isConfirming}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmTransfer} disabled={isConfirming}>
                        {isConfirming && <Loader2 className="w-4 h-4 animate-spin" />}
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
