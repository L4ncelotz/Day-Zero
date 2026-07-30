import bcrypt from "bcryptjs";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    if (process.env.NODE_ENV === "production") {
      console.error("[CRITICAL CONFIG ERROR] ADMIN_PASSWORD_HASH environment variable is missing.");
      return false;
    }
    // In dev mode without ADMIN_PASSWORD_HASH set, default password for testing: "admin123"
    console.warn("[DEV MODE] ADMIN_PASSWORD_HASH unset. Defaulting dev password to 'admin123'");
    return password === "admin123";
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error("Password hash comparison error:", err);
    return false;
  }
}
