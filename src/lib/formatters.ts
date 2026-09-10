export function formatDateLabel(value: string): string { return value; }
export function formatCurrency(value: number): string { return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value); }
