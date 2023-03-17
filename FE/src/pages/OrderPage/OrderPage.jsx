import { Button, Checkbox, Form } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber, WrapperQualityProduct } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slices/orderSlice';
import { convertPrice } from '../../ultils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import Loading from '../../components/LoadingComponent/Loading';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from "../../services/UserService"
import * as message from "../../components/Message/Message"
import { updateUser } from "../../redux/slices/userSlice";
import { useNavigate } from 'react-router-dom';
import Step from '../../components/StepComponent/StepComponent';
import StepComponent from '../../components/StepComponent/StepComponent';

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  // console.log(order);
  const [isOpenModelUpdateInfo, setIsOpenModelUpdateInfo] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: "",
    city: '',
  })
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onChange = (e) => {
    // Coi chỗ này
    if (listChecked.includes(e.target.value)) { //Nếu listchecked có chứa id thg mới bấm ( đã check) =>
      const newListChecked = listChecked.filter((item) => item !== e.target.value) // bỏ check
      setListChecked(newListChecked)
    } else { // renew mảng thêm vào thg id mới
      setListChecked([...listChecked, e.target.value])
    }
  };
  // console.log(listChecked);

  const handleChangeCount = (type, idProduct) => {
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }))
    } else {
      dispatch(decreaseAmount({ idProduct }))
    }
  }
  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }))
  }
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails) //set Value cho form
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModelUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModelUpdateInfo])

  console.log(stateUserDetails);

  const handleChangeAddress = () => {
    setIsOpenModelUpdateInfo(true)
  }

  const handleRemoveAllOrder = () => {
    console.log(listChecked);
    if (listChecked?.length > 0) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, current) => {
      return total + ((current.price * current.amount))
    }, 0)
    return result
  }, [order])
  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, current) => {
      return total + ((current.discount * current.amount))
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])
  const priceDeliveryMemo = useMemo(() => {
    if(priceMemo >= 200000 && priceMemo < 500000){
      return 10000
    }else if(priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMemo])
  const totalPrice = useMemo(() => {
    return priceMemo - priceDiscountMemo + priceDeliveryMemo
  }, [priceMemo, priceDiscountMemo, priceDeliveryMemo])

  const handleCheckout = () => {
    if (!order.orderItemsSelected?.length) {
      message.error("Please choose your product")
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModelUpdateInfo(true)
    } else{
      navigate('/payment')
    }
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      // console.log(data)
      const res = UserService.updateUser(
        id,
        token,
        { ...rests })
      return res
    },
  )

  const { isLoading, data } = mutationUpdate
  // console.log(data);

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      address: '',
      phone: '',
      city: '',
    })
    form.resetFields()
    setIsOpenModelUpdateInfo(false)
  }
  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails
    console.log(stateUserDetails);
    if (name && address && phone && city)
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
          console.log(data);
          setIsOpenModelUpdateInfo(false)
        }
      })
  }
  const handleChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const itemStep = [
    {
      title: '20.000 VND',
      description: 'Under 200.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'From 200.000 VND to under 500.000 VND',
    },
    {
      title: '0 VND',
      description : 'Over 500.000 VND',
    },
  ]
  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3>Cart </h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <WrapperStyleHeaderDilivery>
              <StepComponent items={itemStep} current={priceDeliveryMemo === 10000 
                ? 2 : priceDeliveryMemo === 20000 ? 1 
                : order?.orderItemsSlected?.length === 0 ? 0:  3}/>
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }}>
                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                      <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} alt="" />
                      <div style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{order?.name}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                      </span>
                      <WrapperCountOrder>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)}>
                          <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                        <WrapperInputNumber min={1} defaultValue={order?.amount} value={order?.amount} size="small" />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)}>
                          <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                      </WrapperCountOrder>
                      <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{convertPrice(order?.price * order?.amount)}</span>
                      <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                    </div>
                  </WrapperItemOrder>
                )
              })}
              {order?.orderItems?.length === 0 && (
                <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                  Your cart is empty. Add some products now.
                </p>
              )}
            </WrapperListOrder>
          </WrapperLeft>

          <WrapperRight>
            <div style={{ width: '100%' }}>
              <WrapperInfo>
                <div>
                  <span>Delivery To: </span>
                  <span style={{ fontWeight: 'bold' }}>{user?.address} {user?.city}</span>
                  <span onClick={handleChangeAddress} style={{ color: "blue", cursor: "pointer" }}>Change Address</span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Tạm tính</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Giảm giá</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Phí giao hàng</span>
                  <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDeliveryMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPrice)}</span>
                  <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleCheckout()}
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '320px',
                border: 'none',
                borderRadius: '4px'
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent forceRender title="Update delivery infomation" open={isOpenModelUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser} >
        <Loading isLoading={isLoading}>
          <Form
            name="basic" labelCol={{ span: 4, }}
            wrapperCol={{ span: 20, }}
            form={form}
            autoComplete="on"
            onFinish={handleUpdateInfoUser}
          >
            <Form.Item label="User name"
              name="name"
              rules={[{ required: true, message: 'Please input your user name!', },]}>
              <InputComponent value={stateUserDetails.name} onChange={handleChangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address!', },]}>
              <InputComponent value={stateUserDetails.address} onChange={handleChangeDetails} name="address" />
            </Form.Item>
            <Form.Item label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your phone!', },]}>
              <InputComponent value={stateUserDetails.phone} onChange={handleChangeDetails} name="phone" />
            </Form.Item>
            <Form.Item label="City"
              name="city"
              rules={[{ required: true, message: 'Please input your city!', },]}>
              <InputComponent value={stateUserDetails.city} onChange={handleChangeDetails} name="city" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16, }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default OrderPage