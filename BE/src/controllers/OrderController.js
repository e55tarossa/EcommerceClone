const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    console.log(req.body); 
    const { paymentMethod,itemsPrice,shippingPrice,totalPrice,user,isPaid,paidAt,isDelivered,deliveredAt,fullName,address,discount,city,phone,
    } = req.body;
    if (!paymentMethod ||!itemsPrice ||!totalPrice ||!fullName ||!address ||!city ||!phone ) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if(!orderId) {
      return res.status(200).json({
        status:"ERR",
        message: "The orderId is required"
      })
    }
    const response = await OrderService.cancelOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    if(!userId) {
      return res.status(200).json({
        status:"ERR",
        message: "The userId is required"
      })
    }
    const response = await OrderService.getAllOrderDetails(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if(!orderId) {
      return res.status(200).json({
        status:"ERR",
        message: "The orderId is required"
      })
    }
    const response = await OrderService.getDetailsOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrder
};