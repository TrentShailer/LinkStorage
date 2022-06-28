require("dotenv").config();
import express from "express";
import morgan from "morgan";
import passport from "passport";
import http from "http";
import path from "path";
import query from "./db";
import { v4 } from "uuid";

const config = require("./config.json");

const BearerStrategy = require("passport-azure-ad").BearerStrategy;
const options = {
	identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
	issuer: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
	clientID: config.credentials.clientID,
	audience: config.credentials.clientID, // audience is this application
	validateIssuer: config.settings.validateIssuer,
	passReqToCallback: config.settings.passReqToCallback,
	loggingLevel: config.settings.loggingLevel,
	scope: config.protectedRoutes.linkApi.scopes,
};
const bearerStrategy = new BearerStrategy(options, (token: any, done: any) => {
	// Send user info using the second argument
	done(null, {}, token);
});

const app = express();

app.use(morgan("dev"));
app.use(passport.initialize());

passport.use(bearerStrategy);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/build")));
app.set("json spaces", 2);
app.set("trust proxy", 1);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	/* 	res.header("Access-Control-Allow-Methods", "*"); */
	res.header(
		"Access-Control-Allow-Headers",
		"Authorization, Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.get("/", async (req, res) => {
	return res.sendFile("index.html");
});

app.get("/links", passport.authenticate("oauth-bearer", { session: false }), async (req, res) => {
	let searchText = req.query.search;
	let page: number = parseInt(req.query.page ? req.query.page.toString() : "1") - 1;
	if (!req.authInfo) return res.sendStatus(401);
	let user_id = req.authInfo.aud;

	let sql =
		"SELECT link_id, title, url, description, favourite FROM links WHERE user_id = $1 AND (title LIKE CONCAT('%', $2::text, '%') OR description LIKE CONCAT('%', $2::text, '%')) ORDER BY favourite DESC, title DESC LIMIT 10 OFFSET (10 * $3);";
	let params = [user_id, searchText, page];

	if (searchText === "" || searchText === undefined || searchText === null) {
		sql =
			"SELECT link_id, title, url, description, favourite FROM links WHERE user_id = $1 ORDER BY favourite DESC, title DESC LIMIT 10 OFFSET (10 * $2);";
		params = [user_id, page];
	}

	let links = await query(sql, params);
	let pages = await query("SELECT link_id FROM links WHERE user_id = $1;", [user_id]);
	if (!links || !pages) return res.sendStatus(500);

	let pageCount = Math.ceil(pages.rowCount / 10);

	return res.status(200).json({ links: links.rows, pages: pageCount });
});

app.get(
	"/link/:link_id",
	passport.authenticate("oauth-bearer", { session: false }),
	async (req, res) => {
		let link_id = req.params.link_id;
		if (!req.authInfo) return res.sendStatus(401);

		let user_id = req.authInfo.aud;

		let user_id_query = await query("SELECT user_id FROM links WHERE link_id = $1;", [link_id]);
		if (!user_id_query) return res.sendStatus(500);

		if (user_id_query.rowCount === 0) {
			return res.sendStatus(404);
		}

		if (user_id_query.rows[0].user_id !== user_id) {
			return res.sendStatus(403);
		}

		let result = await query(
			"SELECT link_id, title, url, description, favorite FROM links WHERE link_id = $1 AND user_id = $2",
			[link_id, user_id]
		);
		if (!result) return res.sendStatus(500);
		else {
			res.status(200).json(result.rows[0]);
		}
	}
);

app.patch(
	"/link/:link_id",
	passport.authenticate("oauth-bearer", { session: false }),
	async (req, res) => {
		let body = req.body;
		let link_id = req.params.link_id;
		if (!req.authInfo) return res.sendStatus(401);

		let title: string | undefined = body.title;
		let url: string | undefined = body.url;
		let description: string | undefined | null = body.description;
		let favourite: boolean | undefined = body.favourite;

		if (!title && !url && description === undefined && favourite === undefined) {
			return res.sendStatus(400);
		}
		let user_id = req.authInfo.aud;

		let user_id_query = await query("SELECT user_id FROM links WHERE link_id = $1;", [link_id]);
		if (!user_id_query) return res.sendStatus(500);
		if (user_id_query.rowCount === 0) {
			return res.sendStatus(404);
		}
		if (user_id_query.rows[0].user_id !== user_id) {
			return res.sendStatus(403);
		}

		if (title) {
			let titleQuery = await query(
				"UPDATE links SET title = $1 WHERE link_id = $2 AND user_id = $3 RETURNING title;",
				[title, link_id, user_id]
			);
			if (!titleQuery) {
				return res.sendStatus(500);
			}
		}

		if (url) {
			let urlQuery = await query(
				"UPDATE links SET url = $1 WHERE link_id = $2 AND user_id = $3 RETURNING url;",
				[url, link_id, user_id]
			);
			if (!urlQuery) {
				return res.sendStatus(500);
			}
		}

		if (description !== undefined) {
			let descriptionQuery = await query(
				"UPDATE links SET description = $1 WHERE link_id = $2 AND user_id = $3 RETURNING description;",
				[description, link_id, user_id]
			);
			if (!descriptionQuery) {
				return res.sendStatus(500);
			}
		}

		if (favourite !== undefined) {
			let favouriteQuery = await query(
				"UPDATE links SET favourite = $1 WHERE link_id = $2 AND user_id = $3 RETURNING favourite;",
				[favourite, link_id, user_id]
			);
			if (!favouriteQuery) {
				return res.sendStatus(500);
			}
		}
		return res.sendStatus(200);
	}
);

app.put("/link", passport.authenticate("oauth-bearer", { session: false }), async (req, res) => {
	let body = req.body;
	if (!req.authInfo) return res.sendStatus(401);

	let title = body.title;
	let url = body.url;
	let description = body.description;
	let favourite = body.favourite;

	let user_id = req.authInfo.aud;
	let link_id = v4();

	let result = await query(
		"INSERT INTO links(link_id, user_id, title, url, description, favourite) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;",
		[link_id, user_id, title, url, description, favourite]
	);

	if (result) {
		let row = result.rows[0];
		return res.status(201).json({
			link_id: row.link_id,
			title: row.title,
			url: row.url,
			description: row.description,
			favourite: row.favourite,
		});
	} else return res.sendStatus(500);
});

app.delete(
	"/link/:link_id",
	passport.authenticate("oauth-bearer", { session: false }),
	async (req, res) => {
		let link_id = req.params.link_id;
		if (!req.authInfo) return res.sendStatus(401);
		let user_id = req.authInfo.aud;

		let user_id_query = await query("SELECT user_id FROM links WHERE link_id = $1;", [link_id]);
		if (!user_id_query) return res.sendStatus(500);

		if (user_id_query.rowCount === 0) {
			return res.sendStatus(404);
		}

		if (user_id_query.rows[0].user_id !== user_id) {
			return res.sendStatus(403);
		}

		let result = await query(
			"DELETE FROM links WHERE link_id = $1 AND user_id = $2 RETURNING link_id;",
			[link_id, req.authInfo.aud]
		);

		if (!result) return res.sendStatus(500);
		else return res.sendStatus(200);
	}
);

app.listen(2006, () => {
	console.log("Listening on port 2006");
});
