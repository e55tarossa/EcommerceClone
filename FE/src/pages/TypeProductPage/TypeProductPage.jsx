import { Col, Pagination, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import CardComponent from '../../components/CardComponent/CardComponent'
import Loading from '../../components/LoadingComponent/Loading'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import { useDebounceHooks } from '../../hooks/useDebounce'
import * as ProductService from '../../services/ProductService'
import { WrapperNavbar, WrapperProducts } from './style'

const TypeProductPage = () => {
    const { state } = useLocation()
    //state là tên gọi cũa type được truyền từ typeproduct.jsx qua
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounceHooks(searchProduct, 500)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [paginate, setPaginate] = useState({
        page: 0,
        limit: 10,
        total: 1
    })
    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductByType(type, page, limit)
        if (res?.status === 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPaginate({...paginate, total : res?.totalPage})
            console.log(paginate);
            console.log(res)
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (state) {
            fetchProductType(state, paginate.page, paginate.limit)
        }
    }, [state, paginate.page, paginate.limit])

    const onChange = (current, pageSize) => { 
        // console.log(current, pageSize)
        setPaginate({...paginate, page: current - 1, limit: pageSize})
    }
    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#efefef', height:"calc(100vh-64px)" }}>
                <div style={{ width: '1270px', margin: '0 auto',height:"92vh" }}> 
                {/*  height ^ 100% */}
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height:"calc(100% - 20px)" }}>
                        <WrapperNavbar span={4} >
                            <NavbarComponent />
                        </WrapperNavbar>
                        <Col span={20} style={{display: "flex", flexDirection:"column", justifyContent:"space-between"}}>
                            <WrapperProducts >
                                {products?.filter((pro) => {
                                    if(searchDebounce ==='') {
                                        return pro
                                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce.toLocaleLowerCase())){
                                        return pro
                                    }
                                }).map((product) => {
                                    return (
                                        <CardComponent id={product._id} key={product._id} product={product} />
                                    )
                                })}


                            </WrapperProducts>
                            <Pagination defaultCurrent={paginate.page + 1} total={paginate?.total} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    )
}

export default TypeProductPage