/** Fail fast when auth cannot be configured safely. */
export function assertJwtSecretConfigured(): void {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 16) {
    console.error(
      'FATAL: JWT_SECRET must be set (non-empty, at least 16 characters). See env.example.'
    );
    process.exit(1);
  }
}
