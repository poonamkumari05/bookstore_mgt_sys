const prisma = require("../config/prisma");

// CREATE PAYMENT

exports.createPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const { order_id, payment_method } = req.body;

    /*

allowed:

card
upi
cod

*/

    // validate order belongs to user

    const order = await prisma.orders.findFirst({
      where: {
        order_id,
        user_id: userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // prevent duplicate payment

    const existingPayment = await prisma.payments.findFirst({
      where: {
        order_id,
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already exists for this order",
      });
    }

    // validate payment method

    const allowed = ["card", "upi", "cod"];

    if (!allowed.includes(payment_method)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // create payment

    const payment = await prisma.payments.create({
      data: {
        order_id,

        amount: order.total_amount,

        payment_method,

        payment_status: "completed",
      },
    });

    res.status(201).json({
      message: "Payment successful",

      payment,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET MY PAYMENTS

exports.getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.payments.findMany({
      where: {
        order: {
          user_id: userId,
        },
      },

      include: {
        order: true,
      },
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ADMIN VIEW ALL PAYMENTS

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payments.findMany({
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
