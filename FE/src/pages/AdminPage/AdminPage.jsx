import { Menu } from 'antd'
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import React, { useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { getItem } from '../../ultils';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';

const items = [
  getItem('User management', 'user', <UserOutlined />),
  getItem('Product management', 'product', <AppstoreOutlined />),
  getItem('Order management', 'order', <ShoppingCartOutlined />)
];

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState('')
  const renderPage = (key) => { // hay
    switch (key) {
      case "user":
        return (
          <AdminUser />
        )
      case "product":
        return (
          <AdminProduct />
        )
      case "order":
        return (
          <AdminOrder />
        )
      default:
        return <></>
    }
  }
  const handleOnClick = ({ key }) => {
    setKeySelected(key)
  }

  // console.log(keySelected) chon key nao trong navbar

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex',overflowX:'hidden' }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "100vh"
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding:"15px 0 15px 15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage