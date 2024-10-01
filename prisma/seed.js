import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seeding users
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        fullName: `User ${i}`,
        email: `user${i}@example.com`,
        password: `$2a$10$yDqtXtgRdfBvu8gfn8OAXOrw4o8g3V8sNchU2/XfuHxamZLaFzKFa`,
      },
    });
    users.push(user);
  }

  // Seeding posts for each user
  const posts = [];
  for (let i = 1; i <= 20; i++) {
    const user = users[i - 1]; // Associate each post with a user
    for (let j = 1; j <= 1; j++) {
      // 1 post per user
      const post = await prisma.post.create({
        data: {
          title: `Post Title ${i}-${j}`,
          description: `Post Description for Post ${i}-${j}`,
          commentCount: 2, // Let's assume each post has 2 comments
          userId: user.id,
        },
      });
      posts.push(post);
    }
  }

  // Seeding comments for each post
  for (let i = 1; i <= 40; i++) {
    const post = posts[i % posts.length]; // Associate comments to posts in a round-robin manner
    const user = users[i % users.length]; // Associate comments to users in a round-robin manner
    await prisma.comment.create({
      data: {
        comment: `Comment text ${i} for post ${post.title}`,
        postId: post.id,
        userId: user.id,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
