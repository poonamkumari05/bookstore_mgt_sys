const { PrismaClient } = require("../generated-client");

const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();

    console.log("Database connected successfully ✅");

  } catch (error) {

    console.log("Database failed ❌");
    console.error(error);

  }
}

connectDB();

module.exports = prisma;