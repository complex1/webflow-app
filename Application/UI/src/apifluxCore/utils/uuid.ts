export function generateUUID(): string {
    const timestamp = Date.now().toString(16);
    const randomPart = 'xxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
    return timestamp.slice(-4) + randomPart;
}
