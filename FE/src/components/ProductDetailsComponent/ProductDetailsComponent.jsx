import { Col, Image, Rate, Row } from 'antd'
import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct } from './style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import * as ProductService from '../../services/ProductService'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import {useDispatch, useSelector} from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slices/orderSlice'

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const onChange = (value) => { 
        setNumProduct(Number(value))
        // console.log(numProduct)
    }
    const getDetailsProduct = async (context) => {
        const id = context.queryKey && context?.queryKey[1] //lay trong querykey cua Reactquery
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res?.data
        }
    }

    const handleChangeCount = ( type ) => {
        if(type === 'increase'){
            setNumProduct(numProduct + 1) // 
        } else {
            if(numProduct >= 2) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const handleAddOrderProduct = () => {
        if(!user?.id) {
            navigate('/sign-in', {state: location?.pathname}) // truyền state zo location chung => qua login sài
        } else {
            dispatch(addOrderProduct({
                orderItem: {
                    name : productDetails?.name,
                    amount :numProduct,
                    image : productDetails?.image,
                    price : productDetails?.price,
                    product: productDetails?._id
                } 
            }))
        }
    }

    //     for(const i = 0; i < num; i++){
    //         console.log(i)
    //         return (
    //             <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
    //             )
    //     }
    // }
    //Khi sài query thì cái truyền vào hàm getdetailsproduct sẽ là 1 context
    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], getDetailsProduct, { enabled: !!idProduct }) //enable di co id
    console.log(productDetails);
    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image width={360} src={productDetails?.image}  />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src="https://picsum.photos/80/80" />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src="https://picsum.photos/80/80" />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src="https://picsum.photos/80/80" />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src="https://picsum.photos/80/80" />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src="https://picsum.photos/80/80" />
                        </WrapperStyleColImage>
                    </Row>
                </Col>
                <Col span={14}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        {/* { video 48
                            renderStar(productDetails?.rating)
                        } */}
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating}/>
                        <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{productDetails?.price}</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className='address'>{user?.address}</span> -
                        <span className='change-address'>Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor:"pointer" }}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} onClick={() => handleChangeCount("decrease")}/>
                            </button>
                            <WrapperInputNumber min={1} defaultValue={1} value={numProduct} onChange={onChange} size="small" />
                            <button style={{ border: 'none', background: 'transparent', cursor:"pointer" }}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} onClick={() => handleChangeCount("increase")}/>
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            onClick={handleAddOrderProduct}
                            textButton={'Buy'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 182)',
                                borderRadius: '4px'
                            }}
                            textButton={'Postpaid'}
                            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row>
        </Loading>
    )
}

export default ProductDetailsComponent