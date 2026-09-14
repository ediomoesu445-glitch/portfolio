/**
 * Generates the ADMIN_PASSWORD_HASH value for the admin panel.
 *
 *     node scripts/hash-password.mjs "your password"
 *
 * Prints a PBKDF2 digest as `iterations:salt:hash`. The password itself is
 * never stored anywhere - only this digest, which cannot be reversed back into
 * it. Also prints a fresh ADMIN_SESSION_SECRET, since you need both.
 *
 * Pass the password in quotes. If your shell records history, clear it
 * afterwards or prefix the command with a space where the shell supports that.
 */

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your password"');
  process.exit(1);
}

if (password.length < 12) {
  console.error(
    `That password is ${password.length} characters. Use at least 12:\n` +
      "this is the only thing standing between the internet and your content.",
  );
  process.exit(1);
}

const iterations = 210_000;
const salt = crypto.getRandomValues(new Uint8Array(16));

const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  "PBKDF2",
  false,
  ["deriveBits"],
);

const bits = await crypto.subtle.deriveBits(
  { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
  key,
  256,
);

const hex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const secret = hex(crypto.getRandomValues(new Uint8Array(32)));

console.log("\nAdd both of these to your environment:\n");
console.log(`ADMIN_PASSWORD_HASH=${iterations}:${hex(salt.buffer)}:${hex(bits)}`);
console.log(`ADMIN_SESSION_SECRET=${secret}`);
console.log(
  "\nRotating ADMIN_SESSION_SECRET signs every open session out immediately.\n",
);
