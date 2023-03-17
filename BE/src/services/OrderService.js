const Order = require("../models/OrderProduct");
const Product = require("../models/Product");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    // console.log(newOrder); orderItems: [
    const {orderItems,paymentMethod,itemsPrice,shippingPrice,totalPrice,fullName,address,city,phone,user} = newOrder;
    try {
      // console.log("orderItems", { orderItems });
      const promises = orderItems.map(async (order) => {
        //Find product dieu kien la co du so luong, sao đó tăng giảm amount
        const productData = await Product.findOneAndUpdate(
          { _id: order.product, quantity: { $gte: order.amount } },
          { $inc: { countInStock: -order.amount, salled: +order.amount } },
          { new: true }
        ); // $gte check (>=)  tìm thằng nào đủ để giảm số lượng dc
        console.log(productData);
        if (productData) {
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
          });
          if (createdOrder) {
            return {
              status: "OK",
              message: "Success",
            };
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id)
      if(newData.length) { // neu thg newData có dữ liệu là sl không đủ 
        resolve({
          status: "ERR",
          message: `Product with the ID ${newData.join(',')} not enough in stock`,
        })
      }
      resolve({
        status: "OK",
        message: "Success"
      })
      console.log(results);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({
        user: id,
      });
      console.log(order);

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

module.exports = {
  createOrder,
  getOrderDetails
};
