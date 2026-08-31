import { forwardRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputBoxProps = {
    label: string;
    id: string;
    type?: string;
    error?: string;
} & UseFormRegisterReturn;

const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
    ({ label, id, type = "text", error, ...registerProps }, ref) => {
        return (
            <div className="flex flex-col w-full space-y-2.5">
                <label htmlFor={id} className="text-base font-medium text-black text-left">
                    {label}
                </label>
                <input
                    ref={ref}
                    id={id}
                    type={type}
                    className="border-2 rounded-sm border-gray-200 focus:border-gray-700 p-1.5"
                    {...registerProps}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);
InputBox.displayName = "InputBox";

export default InputBox;
