
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("neon.tech")
        ? { rejectUnauthorized: true }
        : undefined,
    })
  : new Pool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "searchit",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_HOST?.includes("neon.tech")
        ? { rejectUnauthorized: true }
        : undefined,
    });

export default pool;
