const prisma = require("../config/prisma");

// =======================
// ADD TO CART
// =======================
exports.addToCart = async (req, res) => {
  try {
    // console.log("BODY:", req.body); // ✅ DEBUG

    const userId = req.user.id;
    let { book_id, quantity = 1 } = req.body;

    // ✅ ensure number
    book_id = Number(book_id);

    if (!book_id) {
      return res.status(400).json({
        message: "book_id required",
      });
    }

    let cart = await prisma.carts.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: { user_id: userId },
      });
    }

    const book = await prisma.books.findUnique({
      where: { book_id },
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.cart_id,
        book_id,
      },
    });

    if (existingItem) {
      await prisma.cart_items.update({
        where: {
          cart_item_id: existingItem.cart_item_id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return res.json({
        message: "Cart quantity updated",
      });
    }

    await prisma.cart_items.create({
      data: {
        cart_id: cart.cart_id,
        book_id,
        quantity,
      },
    });

    res.json({
      message: "Added to cart",
    });
  } catch (error) {
    // console.log("ADD CART ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
// =======================
// GET CART
// =======================
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.carts.findUnique({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: { book: true },
        },
      },
    });

    res.json(cart || { cart_items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// UPDATE CART ITEM
// =======================
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    const item = await prisma.cart_items.findUnique({
      where: { cart_item_id: id },
      include: {
        cart: true,
        book: true,
      },
    });

    if (!item || item.cart.user_id !== userId) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    if (item.book.stock < quantity) {
      return res.status(400).json({
        error: "Not enough stock",
      });
    }

    const updated = await prisma.cart_items.update({
      where: { cart_item_id: id },
      data: { quantity },
    });

    res.json({
      message: "Cart updated",
      item: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// REMOVE CART ITEM
// =======================
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const item = await prisma.cart_items.findUnique({
      where: { cart_item_id: id },
      include: { cart: true },
    });

    if (!item || item.cart.user_id !== userId) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    await prisma.cart_items.delete({
      where: { cart_item_id: id },
    });

    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
