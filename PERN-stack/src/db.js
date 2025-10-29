import pg from "pg";

export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "admin",
  port: 5432,
  database: "pern",
});

pool.on("connect", () => {
  console.log("Conectado a la base de datos");
});
