import { hash } from "argon2";
import express from "express";
import { v4 } from "uuid";
import query from "../utils/db";
const app = express.Router();

app.post("/account", async (req, res) => {
	let name = req.body.name;
	let password = req.body.password;

	if (name === "" || name === undefined || password === "" || password === undefined)
		return res.status(401).json({ message: "Name and password are required." });
	if (name.length < 4) return res.status(401).json({ message: "Name is too short." });
	if (password.length < 8) return res.status(401).json({ message: "Password is too short" });

	const nameExistsQuery = await query<{ user_id: string }>(
		"SELECT user_id FROM users WHERE LOWER(name) = $1;",
		[name.toLowerCase()]
	);
	if (!nameExistsQuery) return res.sendStatus(500);
	if (nameExistsQuery.rowCount > 0) return res.sendStatus(409);

	let passwordHash = await hash(password);

	const insertQuery = await query<{ user_id: string; name: string }>(
		"INSERT INTO users(user_id, name, password_hash) VALUES($1, $2, $3) RETURNING user_id, name;",
		[v4(), name, passwordHash]
	);
	if (!insertQuery) return res.sendStatus(500);

	let user_id = insertQuery.rows[0].user_id;
	let storedName = insertQuery.rows[0].name;

	req.session.user_info = { user_id: user_id, name: storedName };
	req.session.authenticated = true;

	return res.sendStatus(200);
});

app.delete("/account", async (req, res) => {
	if (!req.session.authenticated) return res.sendStatus(401);
	let user_id = req.session.user_info?.user_id;

	const deleteQuery = await query("DELETE FROM users WHERE user_id = $1;", [user_id]);
	if (!deleteQuery) return res.sendStatus(500);
	return res.sendStatus(200);
});

export { app };
