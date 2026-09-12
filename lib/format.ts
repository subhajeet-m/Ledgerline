type DecimalLike = { toNumber: () => number };

function isDecimalLike(value: unknown): value is DecimalLike {
    return typeof value === "object" && value !== null && typeof (value as DecimalLike).toNumber === "function";
}

export function formatINR(amount: DecimalLike | number | string){
    const accBalance = isDecimalLike(amount)? amount.toNumber(): typeof amount === 'string'? parseFloat(amount):amount;
    if(isNaN(accBalance))
        return '₹0.00';

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(accBalance);
}
