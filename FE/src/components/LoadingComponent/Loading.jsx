import { Spin } from 'antd'
import React from 'react'

const Loading = ({children, isLoading, delay = 200}) => {
  return (
    <Spin spinning={isLoading} delay={500}>
        {children}
    </Spin>
  )
}

export default Loading