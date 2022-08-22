import { Pool, QueryResult } from "pg";

export const pool = new Pool({
	user: process.env.POSTGRES_USER,
	host: "database",
	database: process.env.POSTGRES_DB,
	password: process.env.POSTGRES_PASSWORD,
	port: 5432,
});

async function query<T>(
	sql: string,
	params?: any[] | undefined
): Promise<QueryResult<T> | undefined> {
	try {
		const client = await pool.connect();
		try {
			const res = await client.query<T>(sql, params);
			return res;
		} finally {
			client.release();
		}
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

export default query;
