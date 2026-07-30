import bcrypt from "bcryptjs";
import process from "node:process";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-admin-password.mjs <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nGenerated Bcrypt Hash:");
console.log(hash);
console.log("\nAdd this hash to your environment variables as:");
console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
