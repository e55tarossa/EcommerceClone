import { Menu } from 'antd'
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons'
import React, { useState } from 'react';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { getItem } from '../../ultils';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const items = [
  getItem('User management', 'user', <UserOutlined />),
  getItem('Product management', 'product', <AppstoreOutlined />)
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
      <div style={{ display: 'flex', }}>
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
        <div style={{ flex: 1, padding:"15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage