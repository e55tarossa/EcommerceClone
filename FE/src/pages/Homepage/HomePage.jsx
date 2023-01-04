import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponents from '../../components/SliderComponent/SliderComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'

const HomePage = () => {
  const typesName = ["TV", "WashineMachine", "Laptop"]
  const fetchAllProduct = async () => {
    const res = await ProductService.getAllProduct()
    // console.log(res);
    return res
  }
  const {isLoading, data: products} = useQuery(['products'], fetchAllProduct, {retry: 3, retryDelay:1000})
  // console.log(products)

  return (
    <>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {typesName.map((type) => (
            <TypeProduct name={type} key={type} />
          ))}
        </WrapperTypeProduct>
      </div>


      <div className='body' style={{ width: '100%', backgroundColor: '#efefef', }}>
        <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
          <SliderComponents />
          <WrapperProducts>
            {products?.data?.map((product) => {
              return  <CardComponent key={product._id}  product={product}  />
            })}
          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <WrapperButtonMore textButton="Xem thêm" type="outline" styleButton={{
              border: '1px solid rgb(11, 116, 229)', color: 'rgb(11, 116, 229)',
              width: '240px', height: '38px', borderRadius: '4px'
            }}
              styleTextButton={{ fontWeight: 500 }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage