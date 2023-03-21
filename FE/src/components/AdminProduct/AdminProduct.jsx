import { Button, Checkbox, Form, Input, Modal, Select, Space } from 'antd'
import React, { useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../ultils'
import * as message from "../../components/Message/Message"
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'


const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [rowSelected, setRowSelected] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const user = useSelector(state => state?.user) //lay token
    const initital = () => ({
        name: "",
        price: "",
        description: "",
        rating: "",
        image: "",
        type: "",
        countInStock: "",
        discount: "",
    })
    const [stateProduct, setStateProduct] = useState(initital())
    const [stateProductDetails, setStateProductDetails] = useState(initital())
    const [typeSelect, setTypeSelect] = useState('');


    const searchInput = useRef(null);

    const [form] = Form.useForm()
    // Gọi API Để mutate --------------
    const mutation = useMutationHooks(
        (data) => {
            const { name, price, description, rating, image, type, countInStock, discount } = data
            const res = ProductService.createProduct(data)
            return res
        }
    )

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            // console.log(data)
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, token } = data
            console.log(data)
            const res = ProductService.deleteProduct(id, token)
            return res
        },
    )

    const mutationDeleteMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data // cho id thanh ojbj
            console.log(data)
            const res = ProductService.deleteManyProduct(ids, token)
            return res
        },
    )


    // Get Products ----------------
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const getDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails(res?.data)
        }
        setIsLoadingUpdate(false)
        return res
    }


    const fetchALlTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    //useEffect product -------------
    useEffect(() => {
        if(!isModalOpen){
            form.setFieldsValue(stateProductDetails)
        } else {
            form.setFieldsValue(initital())
        }
    }, [form, stateProductDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            getDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    //Bấm vào nút update => 55 getdetails => trả về data =>  75 useeffect gọi lại render => 71 set vào form
    const handleUpdateProduct = () => {
        // if (rowSelected) {
        //     setIsLoadingUpdate(true)
        //     getDetailsProduct()
        //     // console.log(stateProductDetails);
        //     // console.log(rowSelected); // id
        // }
        setIsOpenDrawer(true)
    }

    const queryProduct = useQuery(['products'], getAllProducts)
    const queryTypeProduct = useQuery(['type-product'], fetchALlTypeProduct)
    const { isLoading: isLoadingProducts, data: products } = queryProduct
    // console.log(products);
    // console.log(queryTypeProduct?.data?.data)
    //render 2 action
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '25px', cursor: 'pointer', marginRight: "20px" }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '25px', cursor: 'pointer' }} onClick={handleUpdateProduct} />
            </div>
        )
    }

    //Xử lý thằng search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     // <Highlighter
        //     //   highlightStyle={{
        //     //     backgroundColor: '#ffc069',
        //     //     padding: 0,
        //     //   }}
        //     //   searchWords={[searchText]}
        //     //   autoEscape
        //     //   textToHighlight={text ? text.toString() : ''}
        //     // />
        //   ) : (
        //     text
        //   ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '<= 50',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                // console.log(value, record), =>, object
                if (value === ">=") return record.price >= 50
                if (value === "<=") return record.price <= 50
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '1 Star',
                    value: '1',
                },
                {
                    text: '2 Star',
                    value: '2',
                },
                {
                    text: '3 Star',
                    value: '3',
                },
                {
                    text: '4 Star',
                    value: '4',
                },
                {
                    text: '5 Star',
                    value: '5',
                },
            ],
            onFilter: (value, record) => {
                // console.log(value, record), =>, object
                if (value === "1") return record.rating <= 1
                if (value === "2") return record.rating <= 2
                if (value === "3") return record.rating <= 3
                if (value === "4") return record.rating <= 4
                if (value === "5") return record.rating >= 5
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: (a, b) => a.type.length - b.type.length,
            ...getColumnSearchProps('type')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const dataTable = products?.data.length && products?.data.map((product) => { return { ...product, key: product._id } })

    //mutaion xong thi se co 
    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdate, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany
    // console.log(mutation);

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: "",
            price: "",
            description: "",
            rating: "",
            image: "",
            type: "",
            countInStock: "",
            discount:""
        })
        form.resetFields()
    };
    // delete product
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    //truyen ham xuong table
    const handleDeleteManyProduct = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
            // dung de refresh table 41 : 7p
            onSettled: () => {
                queryProduct.refetch()
            }
        })
        console.log("_id", { ids });
    }
    const handleCloseDrawer = () => {
        setStateProductDetails({
            name: "",
            price: "",
            description: "",
            rating: "",
            image: "",
            type: "",
            countInStock: "",
            discount: ""
        })
        form.resetFields()
        setIsOpenDrawer(false);
    };

    //Xu ly thanh cong noti -----------
    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success("Create product success")
            handleCancel()
        } else if (data?.status === 'ERR') {
            message.error("Product is exists")
        }
    }, [isSuccess])
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success("Delete product success")
            handleCancelDelete()
        } else if (dataDeleted?.status === 'ERR') {
            message.error("Product is not exists")
        }
    }, [isSuccessDeleted])
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success("Delete products success")
        } else if (dataDeletedMany?.status === 'ERR') {
            message.error("Products is not exists")
        }
    }, [isSuccessDeletedMany])
    useEffect(() => {
        if (isSuccessUpdated && dataUpdate?.status === 'OK') {
            message.success("Update product success")
            handleCloseDrawer()
        } else if (data?.status === 'ERR') {
            message.error("Something wrong")
        }
    }, [isSuccessUpdated])

    //Clip 38 30p
    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            type: stateProduct.type === "add_type" ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            discount : stateProduct.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }
    const handleChange = (e) => {
        setStateProduct({
            ...stateProduct,// giữ lại state không thay đổi
            [e.target.name]: e.target.value
        })
        // console.log(e.target.name, ...e.target.value);
    }
    const handleChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }
    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            // dung de refresh table 41 : 7p
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
    }

    console.log(stateProduct);


    return (
        <div>
            <WrapperHeader>Product Management</WrapperHeader>
            <div style={{ marginTop: "10px" }}>
                <Button onClick={() => setIsModalOpen(!isModalOpen)} style={{ height: "150px", width: "150px", borderRadius: "6px", borderStyle: "dashed" }}><PlusOutlined style={{ fontSize: "60px" }} /></Button>
            </div>
            <div style={{ marginTop: "20px" }}>
                <TableComponent columns={columns} handleDeleteMany={handleDeleteManyProduct} data={dataTable} products={products?.data} isLoading={isLoadingProducts} onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record)
                            setRowSelected(record._id) // lay ra id 
                        }, // click row
                    };
                }} />


            </div>
            <ModalComponent forceRender title="Create product" open={isModalOpen} onCancel={handleCancel} footer={null} >
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic" labelCol={{ span: 6, }}
                        wrapperCol={{ span: 18, }}
                        // initialValues={{
                        //     remember: true,
                        // }}
                        form={form}
                        autoComplete="off"
                        onFinish={onFinish}
                    >
                        <Form.Item label="Product name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your product name!', },]}>
                            <InputComponent value={stateProduct.name} onChange={handleChange} name="name" />
                        </Form.Item>
                        <Form.Item label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!', },]}>
                            <Select
                                name="type"
                                // mode="multiple"
                                placeholder="Inserted are removed"
                                value={stateProduct.type}
                                onChange={handleChangeSelect}
                                style={{
                                    width: '100%',
                                }}
                                options={renderOptions(queryTypeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item label="New Type"
                                name="new-type"
                                rules={[{ required: true, message: 'Please input your type!', },]}>
                                <InputComponent value={stateProduct.newType} onChange={handleChange} name="newType" />
                            </Form.Item>
                        )}
                        {/* <Form.Item label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!', },]}>
                            <InputComponent value={stateProduct.type} onChange={handleChange} name="type" />
                        </Form.Item> */}
                        <Form.Item label="In Stock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count in stock!', },]}>
                            <InputComponent value={stateProduct.countInStock} onChange={handleChange} name="countInStock" />
                        </Form.Item>
                        <Form.Item label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!', },]}>
                            <InputComponent value={stateProduct.price} onChange={handleChange} name="price" />
                        </Form.Item>
                        <Form.Item label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!', },]}>
                            <InputComponent value={stateProduct.rating} onChange={handleChange} name="rating" />
                        </Form.Item>
                        <Form.Item label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount!', },]}>
                            <InputComponent value={stateProduct.discount} onChange={handleChange} name="discount" />
                        </Form.Item>
                        <Form.Item label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your Description!', },]}>
                            <InputComponent value={stateProduct.description} onChange={handleChange} name="description" />
                        </Form.Item>
                        <Form.Item label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your Image!', },]}>
                            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16, }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title="Product Details" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic" labelCol={{ span: 4, }}
                        wrapperCol={{ span: 20, }}
                        form={form}
                        autoComplete="on"
                        onFinish={onUpdateProduct}
                    >
                        <Form.Item label="Product name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your product name!', },]}>
                            <InputComponent value={stateProductDetails.name} onChange={handleChangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!', },]}>
                            <InputComponent value={stateProductDetails.type} onChange={handleChangeDetails} name="type" />
                        </Form.Item>
                        <Form.Item label="In Stock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count in stock!', },]}>
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleChangeDetails} name="countInStock" />
                        </Form.Item>
                        <Form.Item label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!', },]}>
                            <InputComponent value={stateProductDetails.price} onChange={handleChangeDetails} name="price" />
                        </Form.Item>
                        <Form.Item label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!', },]}>
                            <InputComponent value={stateProductDetails.rating} onChange={handleChangeDetails} name="rating" />
                        </Form.Item>
                        <Form.Item label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount!', },]}>
                            <InputComponent value={stateProductDetails.discount} onChange={handleChangeDetails} name="discount" />
                        </Form.Item>
                        <Form.Item label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your Description!', },]}>
                            <InputComponent value={stateProductDetails.description} onChange={handleChangeDetails} name="description" />
                        </Form.Item>
                        <Form.Item label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your Image!', },]}>
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16, }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            {/* delete product modal */}
            <ModalComponent forceRender title="Delete product" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Are you sure to delete this entry ?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}


export default AdminProduct