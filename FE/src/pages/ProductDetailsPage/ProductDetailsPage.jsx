import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'

const ProductDetailsPage = () => {
  // const params = useParams() //lay id tren url xuong
  // console.log(params)
  const {id} = useParams()
  const navigate = useNavigate()
  // console.log(id);
  return (
    <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
      <h5><span style={{cursor:"pointer", fontWeight:"bold"}} onClick={() => navigate('/')}>Home page</span> | Product details</h5>
      <ProductDetailsComponent idProduct={id}/>
    </div>
  )
}

export default ProductDetailsPage