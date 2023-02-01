const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    // console.log(req.body); //input nhap vao
    const { name, image, type, price, countInStock, rating,selled, discount, description } =
      req.body;

    if (!name || !image || !type || !price || !countInStock || !rating) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await ProductService.createProduct(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The product not found",
      });
    }

    const response = await ProductService.updateProduct(productId, data);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const product = req.params.id;
    const response = await ProductService.getDetailsProduct(product);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body.ids // Mot mang  //{ [ '638f01e781250f772726aa91', '638ed29e421defb99394017e' ] }
    // console.log(req.body); //{ ids: [ '638f01e781250f772726aa91', '638ed29e421defb99394017e' ] }
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
 
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductService.getAllProduct(Number(limit) || 100, Number(page) || 0, sort, filter)
        // const response = await ProductService.getAllProduct()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllTypeProduct = async (req, res) => {
    try {
        const response = await ProductService.getAllTypeProduct()
        // const response = await ProductService.getAllProduct()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getAllTypeProduct
};
