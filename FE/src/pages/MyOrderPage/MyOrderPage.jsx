import React, { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { convertPrice } from '../../ultils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { message } from 'antd';

const MyOrderPage = () => {
  const user = useSelector((state) => state.user)
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.access_token)
    return res.data//tra data cho react query
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
    enabled: state?.id && state?.access_token //chi goi khi co 2 thg nay 
  })

  const { isLoading, data } = queryOrder
  console.log('data', data)

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {state : {
      id: state?.id,
      access_token: state?.access_token
    }})
  }

  const mutation = useMutationHooks((data) => {
    const {id, token} = data
    const res = OrderService.cancelOrder(id, token)
    return res
  })

  const handleCanceOrder = (id) => {
    mutation.mutate({id, token: state?.access_token}, {
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
        message.success("Remove order success")
    } else if (dataCancel?.status === 'ERR') {
        message.error("Order is not exists")
    }
}, [isSuccessCancel])


  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem>
        <img src={order?.image} alt={order?.name}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px'
          }}
        />
        <div style={{
          width: 260,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: '10px'
        }}>{order?.name} x {order?.amount}</div>
        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
      </WrapperHeaderItem>
    })
  } //render ra map con


  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h4>My Order</h4>
          <WrapperListOrder>
          {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div><span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</div>
                    <div><span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán:</span>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</div>
                  </WrapperStatus>
                      {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                    <ButtonComponent
                        onClick={() => handleCanceOrder(order?._id)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid rgb(11, 116, 229)',
                            borderRadius: '4px'
                        }}
                        textButton={'Hủy đơn hàng'}
                        styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid rgb(11, 116, 229)',
                            borderRadius: '4px'
                        }}
                        textButton={'Xem chi tiết'}
                        styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage