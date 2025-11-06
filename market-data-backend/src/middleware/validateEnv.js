export function validateEnv() {
  const required = ["JWT_SECRET", "FRONTEND_ORIGIN"];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
}
