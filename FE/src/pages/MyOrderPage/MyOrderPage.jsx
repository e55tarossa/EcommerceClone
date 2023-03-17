import React,{ useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { convertPrice } from '../../ultils';

const MyOrderPage = () => {
  const user = useSelector((state) => state.user)

  const fetchMyOrder = async () => {
    if(user?.id && user?.access_token) {
      const res = await OrderService.getOrderByUserId(user?.id, user?.access_token)
      return res.data//tra data cho react query
    }
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
    enabled: user?.id && user?.access_token //chi goi khi co 2 thg nay 
  })

  const { isLoading, data } = queryOrder
  console.log('data', data)

  return (
    <Loading isLoading={isLoading}>
    <WrapperContainer>
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h4>Đơn hàng của tôi</h4>
        <WrapperListOrder>
          {data?.orderItems?.map((order) => {

            return (
              <WrapperItemOrder key={order?._id}>
                <WrapperStatus>
                  <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                  <div><span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</div>
                  <div><span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán:</span>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</div>
                </WrapperStatus>
                <WrapperHeaderItem> 
                  <img src={order?.image} 
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
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px'
                  }}>{order?.name}</div>
                  <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
                </WrapperHeaderItem>
                <WrapperFooterItem>
                  <div>
                    <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                    <span 
                      style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                    >{convertPrice(data?.totalPrice)}</span>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                  <ButtonComponent
                      // onClick={() => handleAddCard()}
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
                      // onClick={() => handleAddCard()}
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