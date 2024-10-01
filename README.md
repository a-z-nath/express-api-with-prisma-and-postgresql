# REST API with PRISMA & POSTGRESQL

## PRISMA SETUP

```bash
# To install prisma package
npm i prisma

# To create prisma/scema.prisma & related prisma & postgresql setup
npx prisma
npx prisma init
```

Now you can check `prisma/schema.prisma` file it should have contain below contents

```js
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Also check your .env file which will contain similar variable like below

```txt
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
```

To use prisma client you've to install prisma client

```bash
# To install prisma client
npm install @prisma/client
```

```bash
# To migrate prisma orm to sql
npx prisma migrate dev --name <migration-name>
```

## Database Seeding

To seed database using prisma you've to create a file called `seed.js` or `seed.ts`

1.  Add the followind code into your `package.json` script section:

```javascript
 "prisma": {
   "seed": "node prisma/seed.js"
 },
```

2.  Add your seeding data using following code:

```javascript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Here write your seeding data
  // You can also bulk inserting data in database using createMany or createManyAndReturn
  // ... ... ...
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

To learn more about [`createMany` And `createManyAndReturn`](https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-multiple-records)

```bash
# To seed your db run this it will only append data into your db
npx prisma db seed

# To reset and seed you database
npx prisma migrate reset
```
