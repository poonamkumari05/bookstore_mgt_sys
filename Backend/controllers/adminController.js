const prisma = require("../config/prisma");

exports.getDashboard = async (req, res) => {
  try {
    const totalBooks = await prisma.books.count();

    const totalOrders = await prisma.orders.count();

    const payments = await prisma.payments.findMany();

    const totalRevenue = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    const recentOrders = await prisma.orders.findMany({
      take: 5,
      orderBy: {
        created_at: "desc"
      }
    });

    res.json({
      totalBooks,
      totalOrders,
      totalRevenue,
      recentOrders
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};