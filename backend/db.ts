import { Pool, QueryResult } from "pg";

const pool = new Pool({
	user: process.env.POSTGRES_USER,
	host: "0.0.0.0",
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
});

async function query(
	sql: string,
	params?: any[] | undefined
): Promise<QueryResult<any> | undefined> {
	try {
		const client = await pool.connect();
		try {
			const res = await client.query(sql, params);
			return res;
		} finally {
			client.release();
		}
	} catch (error) {
		console.log(error);
	}
}

export default query;
