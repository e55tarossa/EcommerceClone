const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email , orderItems) => {
  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.email",
  //   port: 465,
  //   secure: true, // true for 465, false for other ports
  //   auth: {
  //     user: process.env.MAIL_ACCOUNT, // generated ethereal user
  //     pass: process.env.MAIL_PASSWORD, // generated ethereal password
  //   },
  // });

  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true, // true for 465, false for other ports
      logger: true,
      debug: true,
      secureConnection: false,
      auth: {
        user:  process.env.MAIL_ACCOUNT, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });
  } catch (error) {
    console.log(error);
  }

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
      <div>Bên dưới là hình ảnh của sản phẩm</div>
    </div>`
    attachImage.push({path: order.image})
  })


  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "phuchochay938@gmail.com", // sender address
    to: "phuchochay938@gmail.com", // list of receivers
    subject: "Your Order in E55 is Successful", // Subject line
    text: "Hello We wanted to let you know that your order has been successfully processed. Thank you for choosing E55 as your preferred provider.If you have any questions or concerns, please don't hesitate to reach out to our customer service team.", // plain text body,
    html: `<div><b>Your order in e55store is successful</b></div> ${listItem}`,
    attachments: attachImage,
  });
};

module.exports = {
  sendEmailCreateOrder,
};
