-- AlterTable
CREATE SEQUENCE comments_id_seq;
ALTER TABLE "comments" ALTER COLUMN "id" SET DEFAULT nextval('comments_id_seq');
ALTER SEQUENCE comments_id_seq OWNED BY "comments"."id";

-- AlterTable
CREATE SEQUENCE posts_id_seq;
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT nextval('posts_id_seq');
ALTER SEQUENCE posts_id_seq OWNED BY "posts"."id";
