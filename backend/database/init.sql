CREATE TABLE links (
	link_id UUID PRIMARY KEY NOT NULL,
	user_id VARCHAR NOT NULL,
	title VARCHAR NOT NULL,
	url VARCHAR NOT NULL,
	description VARCHAR,
	favourite BOOLEAN NOT NULL
);