const prisma = require("../config/prisma");


// =========================
// PLACE ORDER (MANUAL)
// =========================

exports.placeOrder = async (req, res) => {
  try {

    const { address_id, items } = req.body;

    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items required"
      });
    }

    // Validate address belongs to user

    const address = await prisma.addresses.findFirst({
      where: {
        address_id,
        user_id: userId
      }
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found"
      });
    }

    let totalAmount = 0;

    const result = await prisma.$transaction(async (tx) => {

      const order = await tx.orders.create({
        data: {
          user_id: userId,
          address_id,
          status: "pending",
          total_amount: 0
        }
      });

      for (const item of items) {

        const book = await tx.books.findUnique({
          where: {
            book_id: item.book_id
          }
        });

        if (!book) {
          throw new Error(`Book ${item.book_id} not found`);
        }

        if (book.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${book.book_name}`);
        }

        await tx.order_items.create({
          data: {
            order_id: order.order_id,
            book_id: item.book_id,
            quantity: item.quantity,
            price: book.price
          }
        });

        await tx.books.update({
          where: {
            book_id: item.book_id
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        totalAmount += Number(book.price) * item.quantity;

      }

      return await tx.orders.update({
        where: {
          order_id: order.order_id
        },
        data: {
          total_amount: totalAmount
        }
      });

    });

    res.status(201).json({
      message: "Order placed successfully",
      order: result
    });

  } catch (error) {

    if (
      error.message.includes("Insufficient stock") ||
      error.message.includes("not found")
    ) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: error.message
    });

  }
};



// =========================
// GET MY ORDERS
// =========================

exports.getMyOrders = async (req, res) => {
  try {

    const userId = req.user.id;

    const orders = await prisma.orders.findMany({
      where: {
        user_id: userId
      },

      include: {
        order_items: {
          include: {
            book: true
          }
        },

        address: true
      }
    });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};



// =========================
// ADMIN GET ALL ORDERS
// =========================

exports.getAllOrders = async (req, res) => {

  try {

    const orders = await prisma.orders.findMany({
      include: {

        user: true,

        address: true,

        order_items: {
          include: {
            book: true
          }
        }

      }
    });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};



// =========================
// UPDATE ORDER STATUS
// =========================

exports.updateOrderStatus = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const order = await prisma.orders.update({
      where: {
        order_id: id
      },

      data: {
        status
      }
    });

    res.json({
      message: "Order status updated",
      order
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};



// =========================
// CHECKOUT
// =========================

exports.checkout = async (req, res) => {

  try {

    const userId = req.user.id;

    const { address_id } = req.body;

    // Validate address belongs to user

    const address = await prisma.addresses.findFirst({
      where: {
        address_id,
        user_id: userId
      }
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found"
      });
    }

    const cart = await prisma.carts.findUnique({
      where: {
        user_id: userId
      },

      include: {
        cart_items: {
          include: {
            book: true
          }
        }
      }
    });

    if (!cart || cart.cart_items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    let total = 0;

    for (const item of cart.cart_items) {

      if (item.book.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.book.book_name} out of stock`
        });
      }

      total += Number(item.book.price) * item.quantity;

    }

    const result = await prisma.$transaction(async (tx) => {

      const order = await tx.orders.create({
        data: {
          user_id: userId,
          address_id,
          total_amount: total
        }
      });

      for (const item of cart.cart_items) {

        await tx.order_items.create({
          data: {
            order_id: order.order_id,
            book_id: item.book_id,
            quantity: item.quantity,
            price: item.book.price
          }
        });

        await tx.books.update({
          where: {
            book_id: item.book_id
          },

          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

      }

      await tx.cart_items.deleteMany({
        where: {
          cart_id: cart.cart_id
        }
      });

      return order;

    });

    res.status(201).json({
      message: "Checkout successful",
      order: result
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};