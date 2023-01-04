import React, { useState } from 'react'
import { Button, Drawer } from 'antd';

const DrawerComponent = ({title= "Drawer", placement="right", isOpen = false,children, ...rests}) => {
    // const [open, setOpen] = useState(false);
    // const showDrawer = () => {
    //     setOpen(true);
    // };
    // const onClose = () => {
    //     setOpen(false);
    // };
    return (
        <>
            {/* <Button type="primary" onClick={showDrawer}>
                Open
            </Button> */}
            <Drawer title={title} placement={placement}  open={isOpen} {...rests}>
                {children}
            </Drawer>
        </>
    )
}

export default DrawerComponent