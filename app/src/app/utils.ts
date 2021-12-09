export function numberToCssHex(n: number): string{
    return `#${n.toString(16).toUpperCase().padStart(6, "0")}`
}
export function cssHexToNumber(hex: string): number{
    return parseInt(hex.substr(1), 16);
}
