import { AuthenticateCredentialsResult, ExistsResult } from "./types";
import * as argon2 from "argon2";
import query from "./db";

async function AuthenticateCredentials(
	name: string,
	password: string
): Promise<AuthenticateCredentialsResult> {
	let passwordHashQuery = await query<{ name: string; user_id: string; password_hash: string }>(
		"SELECT name, user_id, password_hash FROM users WHERE LOWER(name) = $1;",
		[name.toLowerCase()]
	);
	if (!passwordHashQuery) return { valid: false, error: true };
	if (passwordHashQuery.rowCount === 0) return { valid: false };

	let hashMatches = await argon2.verify(passwordHashQuery.rows[0].password_hash, password);
	if (hashMatches) {
		return {
			valid: hashMatches,
			userData: {
				user_id: passwordHashQuery.rows[0].user_id,
				name: passwordHashQuery.rows[0].name,
			},
		};
	}
	return { valid: false };
}

async function UserExists(user_id?: string): Promise<ExistsResult> {
	let result = await query<{ user_id: string }>("SELECT user_id FROM users WHERE user_id = $1;", [
		user_id,
	]);
	if (!result) return { exists: false, error: true };
	if (result.rowCount === 0) return { exists: false };
	return { exists: true };
}

export { AuthenticateCredentials, UserExists };
