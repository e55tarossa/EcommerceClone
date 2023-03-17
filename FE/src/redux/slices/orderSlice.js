import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {},
    paymentMethod: "",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: "",
    isPaid: false,
    paidAt: "",
    isDelivered: false,
    deliveredAt: "",
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
        //xem state trong redux
        // console.log({state, action});
        // console.log(state?.orderItems);
        const {orderItem} = action.payload // nguyen cai item mà order
        const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product) // check add nhieu lan
        if(itemOrder) {
            itemOrder.amount += orderItem?.amount
        } else {
            state.orderItems.push(orderItem)
        }
    },
    increaseAmount: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct) // check add nhieu lan
        const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct) // check add nhieu lan
        itemOrder.amount++
        if(itemOrderSelected){
            itemOrderSelected.amount++
        }
    },
    decreaseAmount: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct) // check add nhieu lan
        const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct) // check add nhieu lan
        if(itemOrder.amount >= 2){
            itemOrder.amount--
            if(itemOrderSelected){
                itemOrderSelected.amount--
            }
        }
    },
    removeOrderProduct: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct)

        state.orderItems = itemOrder
        state.orderItemsSelected = itemOrderSelected
    },
    removeAllOrderProduct: (state, action) => {
        // console.log({state, action});
        const {listChecked} = action.payload
        // console.log(listChecked);
        // console.log(listChecked);
        const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
        const itemOrdersSelected = state?.orderItemsSelected?.filter((item) => !listChecked.includes(item.product))
        state.orderItems = itemOrders 
        state.orderItemsSelected = itemOrdersSelected 
    },
    selectedOrder : (state, action) =>{
        const {listChecked} = action.payload
        const orderSelected = []
        state.orderItems.forEach((order) => { //Quét mảng order lấy ra từng cái cái nào có id thì push vào mảng selected
            if(listChecked.includes(order.product)){
                orderSelected.push(order)
            }
        })
        state.orderItemsSelected = orderSelected
        // console.log(state.orderItemsSelected);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct , decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct,selectedOrder} = orderSlice.actions

export default orderSlice.reducer