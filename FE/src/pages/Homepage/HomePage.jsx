import React, { useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponents from '../../components/SliderComponent/SliderComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounceHooks } from '../../hooks/useDebounce'

const HomePage = () => {
  const productSearchValue = useSelector((state) => state.product?.search)
  const searchDebounce = useDebounceHooks(productSearchValue, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(6)
  // const [page, setLimit] = useState(6)
  const [typeProduct, setTypeProduct] = useState([])

  const fetchAllProduct = async (context) => {
    console.log(context); // queryKey :Array(2) 0:"products" 1 :  12
    const limit = context.queryKey[1]
    const searchValue = context.queryKey[2]
    const res = await ProductService.getAllProduct(searchValue, limit)
    return res
  }

  const fetchALlTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === "OK") {
      setTypeProduct(res?.data)
    }
  }

  const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchAllProduct, { retry: 3, retryDelay: 1000, keepPreviousData: true })
  // console.log(products)
  // console.log(isPreviousData, isLoading)

  useEffect(() => {
    fetchALlTypeProduct()
  }, [])

  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {typeProduct.map((type) => (
            <TypeProduct name={type} key={type} />
          ))}
        </WrapperTypeProduct>
      </div>


      <div className='body' style={{ width: '100%', backgroundColor: '#efefef', }}>
        <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
          <SliderComponents />
          <WrapperProducts>
            {products?.data?.map((product) => {
              return <CardComponent id={product._id} key={product._id} product={product} />
            })}
          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <WrapperButtonMore textButton={isPreviousData ? "LoadMore" : "Xem thêm"} type="outline" styleButton={{
              border: '1px solid rgb(11, 116, 229)', color: `${products?.total === products?.data?.length ? "#ccc" : `rgb(11, 116, 229)`}`,
              width: '240px', height: '38px', borderRadius: '4px'
            }}
              disabled={products?.total === products?.data?.length || products?.totalPage === 1}
              styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && "#fff" }}
              onClick={() => setLimit((prev) => prev + 6)} />
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default HomePage