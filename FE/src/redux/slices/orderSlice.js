import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
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
        console.log({state, action});
        // console.log(state?.orderItems);
        const {orderItem} = action.payload // nguyen cai item mà order
        const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product) // check add nhieu lan
        if(itemOrder) {
            itemOrder.amount += orderItem?.amount
        } else {
            state?.orderItems.push(orderItem)
        }
    },
    increaseAmount: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct) // check add nhieu lan
        itemOrder.amount++
    },
    decreaseAmount: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct) // check add nhieu lan
        if(itemOrder.amount >= 2){
            itemOrder.amount--
        }
    },
    removeOrderProduct: (state, action) => {
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product !== idProduct)
        state.orderItems = itemOrder
    },
    removeAllOrderProduct: (state, action) => {
        // console.log({state, action});
        const {listChecked} = action.payload
        // console.log(listChecked);
        // console.log(listChecked);
        const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
        state.orderItems = itemOrders 
    }
  },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct , decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct} = orderSlice.actions

export default orderSlice.reducer