import { Checkbox, Rate } from 'antd'
import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './style'

const NavbarComponent = () => {
    const onChange = () => {

    }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return <WrapperTextValue>{option}</WrapperTextValue>
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (<Checkbox style={{ marginLeft: 0 }} value={option.value}>{option.lable}</Checkbox>)
                        })}
                    </Checkbox.Group>
                )   
            case 'star': 
                return options.map((option) => {
                    return(
                        <div style={{ dispaly: 'flex' }}>
                            <Rate style={{ fontSize: '12px' }}  defaultValue={option}/>
                            <span> {`From ${option}  Star`}</span>
                        </div>
                    )
                })
                case 'price':
                return options.map((option) => {
                    return (
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                })

            default:
                return {}
        }
    }

    return (
        <div>
            <WrapperLableText>Label</WrapperLableText>
            <WrapperContent>
                {renderContent('text', ['LAPTOP', 'TV', 'WashineMachine'])}
                {renderContent('checkbox', [
                    { value: 'a', lable: "A" },
                    { value: 'b', lable: "B" }
                ])}
                {renderContent('star', [3,4,5])}
                {renderContent('price', ["Under 40","50","Upper 50"])}
            </WrapperContent>
        </div>
    )
}

export default NavbarComponent