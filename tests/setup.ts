import dotenv from "dotenv";

// Loaded as a Vitest setupFile, guaranteed to finish running before any test
// file's own imports are evaluated — this is what lets lib/prisma.ts (which
// reads process.env.DATABASE_URL at module-load time, not lazily) see the
// right values instead of undefined.
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
