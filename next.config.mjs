import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    APP_ENV: process.env.APP_ENV,
    NEXT_PORT: process.env.NEXT_PORT,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_FIREBASE_API_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_FIREBASE_AUTH_DOMAIN,
  },
};

export default nextConfig;
