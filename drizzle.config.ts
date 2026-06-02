import type { Config } from "drizzle-kit"

export default {
    schema: "./lib/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://neondb_owner:npg_kajVdHESo48A@ep-hidden-darkness-aqx7n9ng.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
    },
} satisfies Config