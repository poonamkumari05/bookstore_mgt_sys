const prisma = require("../config/prisma");

/*
ADD ADDRESS
Consumer adds address
*/

exports.createAddress = async (req, res) => {
  try {
    const { city, state, pincode } = req.body;

    if (!city || !state || !pincode) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const address = await prisma.addresses.create({
      data: {
        user_id: req.user.id,

        city,
        state,
        pincode,
      },
    });

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//=========================
//GET USER ADDRESSES
//=========================

exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await prisma.addresses.findMany({
      where: {
        user_id: req.user.id,
      },
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//=========================
//GET ADDRESS BY ID
//=========================

exports.getAddressById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const address = await prisma.addresses.findUnique({
      where: { address_id: id },
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (address.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
//=========================
//UPDATE ADDRESS
//=========================

exports.updateAddress = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { city, state, pincode } = req.body;

    // 1. Find address
    const address = await prisma.addresses.findUnique({
      where: { address_id: id },
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // 2. Ownership check
    if (address.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    // 3. Update
    const updated = await prisma.addresses.update({
      where: { address_id: id },
      data: { city, state, pincode },
    });

    res.json({
      message: "Address updated",
      address: updated,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//=========================
//DELETE ADDRESS
//=========================

exports.deleteAddress = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // 1. Find address
    const address = await prisma.addresses.findUnique({
      where: { address_id: id },
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // 2. Ownership check
    if (address.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    // 3. Delete
    await prisma.addresses.delete({
      where: { address_id: id },
    });

    res.json({
      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
