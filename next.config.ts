import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Make sure the pre-filled SQLite file is included in the Vercel functions.
  outputFileTracingIncludes: {
    "/api/notes": ["./prisma/dev.db"],
    "/api/notes/*": ["./prisma/dev.db"],
  },
};

export default nextConfig;
