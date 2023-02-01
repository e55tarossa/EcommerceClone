import { Button, Input } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
  const {
    size, placeholder, textButton,  
    bordered, backgroundColorInput = '#fff',
    backgroundColorButton = 'rgb(13, 92, 182)',
    colorButton = '#fff'
  } = props

  return (
    <div style={{ display: 'flex', }}>
      <InputComponent placeholder={placeholder} style={{ backgroundColor: backgroundColorInput, borderRadius:"0px",border:"none" }} {...props}/>
      <ButtonComponent icon={<SearchOutlined/>} style={{backgroundColor: backgroundColorButton,borderRadius:"0px",border:"none", color:colorButton}}  textButton={textButton}/>
    </div>
  )
}

export default ButtonInputSearch