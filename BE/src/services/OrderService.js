const Order = require("../models/OrderProduct");
const Product = require("../models/Product");
const EmailService = require("../services/EmailService");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    // console.log(newOrder); orderItems: [
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      email,
      isPaid,
      paidAt,
    } = newOrder;
    try {
      // console.log("orderItems", { orderItems });
      const promises = orderItems.map(async (order) => {
        //Find product dieu kien la co du so luong, sao đó tăng giảm amount
        const productData = await Product.findOneAndUpdate(
          { _id: order.product, countInStock: { $gte: order.amount } },
          { $inc: { countInStock: -order.amount, salled: +order.amount } },
          { new: true }
        ); // $gte check (>=)  tìm thằng nào đủ để giảm số lượng dc
        console.log(productData);
        if (productData) {
          return {
            status: "OK",
            message: "Success",
          };
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id || null);
      // console.log(newData); la 1 object
      if (newData.length) { //tao order
        // neu thg newData có dữ liệu là sl không đủ
        const arrId = [] 
         newData.forEach((item) => {
          arrId.push(item)
        })
        resolve({
          status: "ERR",
          message: `Product with the ID ${arrId.join(
            ","
          )} not enough in stock`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName: fullName,
            address: address,
            city: city,
            phone: phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          paidAt,
        });
        if (createdOrder) {
          await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "OK",
            message: "Success",
          });
        }
      }
      // console.log(results);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });
      // console.log(order);

      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      // console.log(order);

      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order details is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const checkOrder = await Order.findByIdAndDelete(id)
      const orderId = await Order.findById(id);
      const promises = orderId.orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          { _id: order.product, countInStock: { $gte: order.amount } },
          { $inc: { countInStock: +order.amount, salled: -order.amount } },
          { new: true }
        );
        if (productData) {
          const checkOrder = await Order.findByIdAndDelete(id);
          if (checkOrder === null) {
            resolve({
              status: "ERR",
              message: "The order is not defined",
            });
          }
          resolve({
            status: "OK",
            message: "Remove order success",
            data: checkOrder,
          });
        }
      });

      await Promise.all(promises);
      resolve({
        status: "OK",
        message: "Remove order success",
        data: checkOrder,
      });
    } catch (e) {
      reject(e.message);
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrder,
};
