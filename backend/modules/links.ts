import express from "express";
import { v4 } from "uuid";
import query from "../utils/db";
import { UserExists } from "../utils/utils";
const app = express.Router();

app.get("/links", async (req, res) => {
	if (!req.session.authenticated) return res.sendStatus(401);

	let userExists = await UserExists(req.session.user_info?.user_id);
	if (userExists.error) return res.sendStatus(500);
	if (!userExists.exists) return res.sendStatus(401);

	if (!req.session.user_info) return res.sendStatus(500);

	let user_id = req.session.user_info.user_id;
	let searchText = req.query.search;
	let page: number = parseInt(req.query.page ? req.query.page.toString() : "1") - 1;

	let sql = `SELECT link_id, title, url, description, favourite FROM links
			WHERE user_id = $1
			AND (title LIKE CONCAT('%', $2::text, '%') OR description LIKE CONCAT('%', $2::text, '%'))
			ORDER BY favourite DESC, title ASC
			LIMIT 10 OFFSET (10 * $3);`;
	let pageSql = `SELECT link_id FROM links
			WHERE user_id = $1
			AND (title LIKE CONCAT('%', $2::text, '%') OR description LIKE CONCAT('%', $2::text, '%'));`;
	let params = [user_id, searchText, page];
	let pageParams = [user_id, searchText];

	if (searchText === "" || !searchText) {
		sql = `SELECT link_id, title, url, description, favourite FROM links
			WHERE user_id = $1
			ORDER BY favourite DESC, title ASC
			LIMIT 10 OFFSET (10 * $2);`;
		pageSql = `SELECT link_id FROM links
			WHERE user_id = $1;`;
		params = [user_id, page];
		pageParams = [user_id];
	}
	let linksQuery = await query<{
		link_id: string;
		title: string;
		url: string;
		description: string;
		favourite: boolean;
	}>(sql, params);
	if (!linksQuery) return res.sendStatus(500);

	let pageQuery = await query(pageSql, pageParams);
	if (!pageQuery) return res.sendStatus(500);

	let pageCount = Math.ceil(pageQuery.rowCount / 10);

	return res.json({ links: linksQuery.rows, pages: pageCount });
});

app.post("/link", async (req, res) => {
	if (!req.session.authenticated) return res.sendStatus(401);

	let userExists = await UserExists(req.session.user_info?.user_id);
	if (userExists.error) return res.sendStatus(500);
	if (!userExists.exists) return res.sendStatus(401);

	let title = req.body.title;
	let url = req.body.url;
	let description = req.body.description;
	let favourite = req.body.favourite;

	if (!title || !url || description === undefined || favourite === undefined)
		return res.sendStatus(400);

	let insertQuery = await query(
		"INSERT INTO links(link_id, user_id, title, url, description, favourite) VALUES ($1, $2, $3, $4, $5, $6);",
		[v4(), req.session.user_info?.user_id, title, url, description, favourite]
	);
	if (!insertQuery) return res.sendStatus(500);
	return res.sendStatus(200);
});

app.patch("/link/:link_id", async (req, res) => {
	if (!req.session.authenticated) return res.sendStatus(401);

	let userExists = await UserExists(req.session.user_info?.user_id);
	if (userExists.error) return res.sendStatus(500);
	if (!userExists.exists) return res.sendStatus(401);

	let link_id = req.params.link_id;

	let ownerQuery = await query<{ user_id: string }>(
		"SELECT user_id FROM links WHERE link_id = $1",
		[link_id]
	);
	if (!ownerQuery) return res.sendStatus(500);
	if (ownerQuery.rowCount === 0) return res.sendStatus(404);
	if (ownerQuery.rows[0].user_id !== req.session.user_info?.user_id) return res.sendStatus(403);

	let title: string | undefined = req.body.title;
	let url: string | undefined = req.body.url;
	let description: string | undefined | null = req.body.description;
	let favourite: boolean | undefined = req.body.favourite;

	if (!title && !url && description === undefined && favourite === undefined)
		return res.sendStatus(400);

	if (title) {
		let titleQuery = await query("UPDATE links SET title = $1 WHERE link_id = $2", [
			title,
			link_id,
		]);
		if (!titleQuery) return res.sendStatus(500);
	}
	if (url) {
		let urlQuery = await query("UPDATE links SET url = $1 WHERE link_id = $2", [url, link_id]);
		if (!urlQuery) return res.sendStatus(500);
	}
	if (description !== undefined) {
		let descriptionQuery = await query("UPDATE links SET description = $1 WHERE link_id = $2", [
			description,
			link_id,
		]);
		if (!descriptionQuery) return res.sendStatus(500);
	}
	if (favourite !== undefined) {
		let favouriteQuery = await query("UPDATE links SET favourite = $1 WHERE link_id = $2", [
			favourite,
			link_id,
		]);
		if (!favouriteQuery) return res.sendStatus(500);
	}
	return res.sendStatus(200);
});

app.delete("/link/:link_id", async (req, res) => {
	if (!req.session.authenticated) return res.sendStatus(401);

	let userExists = await UserExists(req.session.user_info?.user_id);
	if (userExists.error) return res.sendStatus(500);
	if (!userExists.exists) return res.sendStatus(401);

	let link_id = req.params.link_id;

	let ownerQuery = await query<{ user_id: string }>(
		"SELECT user_id FROM links WHERE link_id = $1",
		[link_id]
	);
	if (!ownerQuery) return res.sendStatus(500);
	if (ownerQuery.rowCount === 0) return res.sendStatus(404);
	if (ownerQuery.rows[0].user_id !== req.session.user_info?.user_id) return res.sendStatus(403);

	let deleteQuery = await query("DELETE FROM links WHERE link_id = $1", [link_id]);
	if (!deleteQuery) return res.sendStatus(500);
	return res.sendStatus(200);
});

export { app };
