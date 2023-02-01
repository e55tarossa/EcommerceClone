const Product = require("../models/Product");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description, salled, discount } =
      newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The Product is already exists",
        });
      }
      const createdProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        salled,
        discount
      });
      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Success",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });

      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      // console.log("updatedProduct", updatedProduct);

      resolve({
        status: "OK",
        message: "Success",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });

      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
  // console.log(ids);
    return new Promise(async (resolve, reject) => {
        try {
            // const checkProduct = await Product.findOne({
            //     _id: id
            // })
            // if (checkProduct === null) {
            //     resolve({
            //         status: 'ERR',
            //         message: 'The product is not defined'
            //     })
            // }

            await Product.deleteMany({ _id : ids})
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.count()
            // console.log(filter);
            if (filter) {
                const label = filter[0]; // label = key => [label] thanh key
                const allObjectFilter = await Product.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit) //filter[0]: name ,filter[1]:ten item regex de khong filter chinh xac
                // [label]: {...} name: laptop1
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            // console.log(sort);
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0] // {name : "asc"} get-all?page=0&sort=asc&sort=name
                console.log(objectSort);
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            const allProduct = await Product.find().limit(limit).skip(page * limit) //skip lay tu phan tu so may (page * limit 5:30 #24)
            //  const allProduct = await Product.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllTypeProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allTypeProduct = await Product.distinct('type')
            //  const allProduct = await Product.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allTypeProduct,
            })
        } catch (e) {
            reject(e)
        }
    })
}




module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllTypeProduct
};
