import React from 'react'
import { NameProduct, WrapperCard, WrapperDiscountText, WrapperPriceText, WrapperReportText } from './style'
import { StarFilled } from "@ant-design/icons"
import logo from '../../assets/images/logo.png'

const CardComponent = ({product}) => {
    return (
        <WrapperCard
            hoverable
            style={{
                width: 200,
            }}
            bodyStyle={{padding:"10px"}}
            cover={<img alt="example" src="https://picsum.photos/200" />}
        >   
        {/* <img src={logo} alt="" style={{width:"68px",height:"14px",position:"absolute", top:"-1", left: "-1", borderTopLeftRadius:"3px"}}/> */}
            <NameProduct>{product.name}</NameProduct>
            <WrapperReportText>
                <div>{product.rating} <StarFilled style={{fontSize:"10px", color: "yellow"}}/></div>
                <div>| {product.salled || 1000}   Sale+ </div>
            </WrapperReportText>
            
            <WrapperPriceText>
               <span style={{marginRight: "8px"}}>{product.price + ".000.00"}</span> 
                <WrapperDiscountText>-{product.discount || "20"}%</WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCard>
    )
}

export default CardComponent