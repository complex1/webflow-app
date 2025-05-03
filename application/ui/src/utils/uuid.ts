let count = 1;
export function generateUUID(): string {
    const uuid = '' + count++;
    return uuid;
}