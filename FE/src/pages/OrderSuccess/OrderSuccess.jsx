import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { convertPrice } from '../../ultils';
import { orderContant } from '../../contant';


const OrderSucess = () => {
  const location = useLocation()
  // console.log(location);
  const {state} = location //lay duoc 1 state la mot object qua location 
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isLoading={false}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3>Order success</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Delivery Method</Lable>
                    <WrapperValue>
                      <span style={{color: '#ea8500', fontWeight: 'bold'}}>
                        {orderContant.delivery[state?.delivery]}
                      </span> Giao hàng tiết kiệm
                    </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Checkout Method</Lable>
                
                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order.name}>
                      <div style={{width: '500px', display: 'flex', alignItems: 'center', gap: 4}}> 
                        <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}} alt=""/>
                        <div style={{
                          width: 260,
                          overflow: 'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace:'nowrap'
                        }}>{order?.name}</div>
                      </div>
                      <div style={{flex: 1, display: 'flex', alignItems: 'center',gap: '10px'}}>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>Price: {convertPrice(order?.price)}</span>
                        </span>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>Amount: {order?.amount}</span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperItemOrderInfo>
              <div>
                <span style={{ fontSize: '16px', color: 'red' }}>Total price: {convertPrice(state?.totalPriceMemo)}</span>
              </div>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSucess