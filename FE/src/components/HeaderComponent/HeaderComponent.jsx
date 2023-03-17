import { Badge, Col, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperAccountHeader, WrapperCartHeader, WrapperContentPopup, WrapperHeader, WrapperTextHeader } from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slices/userSlice'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slices/productSlice';


const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const user = useSelector(state => state.user)
  const order = useSelector(state => state.order)
  // console.log(order)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [userAvatar, setUserAvatar] = useState('')
  const [userName, setUserName] = useState("")
  const [search, setSearch] = useState("")
  const [isOpenPopUp, setIsOpenPopUp] = useState(false)
  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name])


  const Content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>User Information</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>System Management</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>My order</WrapperContentPopup>
      <WrapperContentPopup onClick={handleLogout}>Logout</WrapperContentPopup>
    </div>
  )

  const handleClickNavigate = (type) => {
    if (type === 'profile') {
      navigate("/profile-user")
    } else if (type === 'admin') {
      navigate("/system/admin")
    } else if (type === 'my-order') {
      navigate("/my-order")
    } else {
      handleLogout()
    }
    setIsOpenPopUp(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
    // console.log(e.target.value) value khi search
  }
  return (
    <div>
      <WrapperHeader gutter={16} style={{ justifyContent: isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader>
            <Link to="/" style={{color :"white"}}>
              e55Store
            </Link>
          </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (<Col span={13}>
          <ButtonInputSearch
            textButton="Search"
            placeholder="Search your product ..."
            onChange={onSearch}
          />
        </Col>)}

        <Col span={6} style={{ display: "flex", gap: "54px" }}>
          <Loading isLoading={loading}>
            <WrapperAccountHeader>
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={Content} title="User settings" trigger="click" open={isOpenPopUp}>
                    <div onClick={() => setIsOpenPopUp((prev) => !prev)} style={{ cursor: "pointer" }}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
                </>
              ) :
                (<div >
                  <Link to="/sign-in" style={{ color: "white" }}>
                    <span>Login / Register </span>
                  </Link>
                  <div>
                    <span>Account <CaretDownOutlined /></span>
                  </div>
                </div>)
              }

            </WrapperAccountHeader>
          </Loading>
          {!isHiddenCart && (<WrapperCartHeader onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
            <Badge count={order?.orderItems?.length} size="small">
              <ShoppingCartOutlined style={{ fontSize: '30px', color: "#fff" }} />
            </Badge>
            <span>Cart</span>
          </WrapperCartHeader>)}

        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent