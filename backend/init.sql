CREATE TABLE "users" (
	"user_id" UUID PRIMARY KEY NOT NULL,
	"name" VARCHAR NOT NULL,
	"password_hash" VARCHAR NOT NULL
);
CREATE INDEX "IDX_users_name" ON "users" ("name");


CREATE TABLE "links" (
	"link_id" UUID PRIMARY KEY NOT NULL,
	"user_id" UUID NOT NULL,
	"title" VARCHAR NOT NULL,
	"url" VARCHAR NOT NULL,
	"description" VARCHAR,
	"favourite" BOOLEAN NOT NULL,
	CONSTRAINT "fk_user_id" FOREIGN KEY("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE
);
CREATE INDEX "IDX_links_user_id" ON "links" ("user_id");

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
