const express = require("express")
const router = express.Router()
const OrderController = require("../controllers/OrderController")
const {  authUserMiddleWare, authMiddleWare } = require("../middleware/auth")

router.post("/create",authUserMiddleWare, OrderController.createOrder)
router.get("/get-all-order/:id",authUserMiddleWare, OrderController.getAllOrderDetails)
router.get("/get-details-order/:id",authUserMiddleWare, OrderController.getDetailsOrder)
router.delete("/cancel-order/:id",authUserMiddleWare, OrderController.cancelOrder)
router.get("/get-all-order",authMiddleWare, OrderController.getAllOrder)


module.exports = router