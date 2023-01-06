const express = require("express")
const router = express.Router()
const ProductController = require("../controllers/ProductController")
const { authMiddleWare } = require("../middleware/auth")

router.post("/create", ProductController.createProduct)
router.put("/update/:id",authMiddleWare, ProductController.updateProduct)
router.get("/details/:id", ProductController.getDetailsProduct)
router.delete('/delete/:id',authMiddleWare, ProductController.deleteProduct)
router.post('/delete-many',authMiddleWare, ProductController.deleteManyProduct)
router.get('/get-all', ProductController.getAllProduct)




module.exports = router