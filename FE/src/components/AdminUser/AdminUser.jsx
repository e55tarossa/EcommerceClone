import { Button, Form, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { SearchOutlined, PlusOutlined, CheckCircleOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import * as message from "../../components/Message/Message"
import * as UserService from "../../services/UserService"
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { getBase64 } from '../../ultils'

const AdminUser = () => {
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [rowSelected, setRowSelected] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const user = useSelector(state => state?.user) //lay token
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar:"",
        address:""
    })

    const searchInput = useRef(null);

    const [form] = Form.useForm()

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            // console.log(data)
            const res = UserService.updateUser(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, token } = data
            // console.log(data)
            const res = UserService.deleteUser(id, token)
            return res
        },
    )

    const mutationDeleteMany = useMutationHooks(
        (data) => {
            const {  token, ...ids } = data // cho id thanh ojbj
            console.log(data)
            const res = UserService.deleteManyUser(ids, token)
            return res
        },
    )

    // Get Users ----------------
    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        return res
    }

    const getDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setStateUserDetails(res?.data)
        }
        setIsLoadingUpdate(false)
        return res
    }

    //useEffect user -------------
    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            getDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    //Bấm vào nút update => 55 getdetails => trả về data =>  75 useeffect gọi lại render => 71 set vào form
    const handleUpdateUser = () => {
        // if (rowSelected) {
        //     setIsLoadingUpdate(true)
        //     getDetailsUser()
        //     // console.log(stateUserDetails);
        //     // console.log(rowSelected); // id
        // }
        setIsOpenDrawer(true)
    }

    const queryUser = useQuery(['users'], getAllUsers)
    const { isLoading: isLoadingUsers, data: users } = queryUser
    // console.log(users);

    //render 2 action
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '25px', cursor: 'pointer', marginRight: "20px" }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '25px', cursor: 'pointer' }} onClick={handleUpdateUser} />
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
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps('email')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'True',
                    value: true,
                },
                {
                    text: 'False',
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                // console.log(value, record), =>, object
                if (value) return record.isAdmin
                if (value === false) return !record.isAdmin
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')
        },
        // {
        //     title: 'Password',
        //     dataIndex: 'password',
        //     sorter: (a, b) => a.password.length - b.password.length,
        //     ...getColumnSearchProps('password')
        // },
        // {
        //     title: 'Avatar',
        //     dataIndex: 'avatar',
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const dataTable = users?.data.length && users?.data.map((user) => { return { ...user, key: user._id, isAdmin: user.isAdmin ? <CheckCircleOutlined style={{ color: "green" }} /> : null } })

    //mutaion xong thi se co 
    const { data: dataUpdate, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany
    // console.log(mutation);

    // delete user
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleDeleteManyUser = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token}, {
            // dung de refresh table 41 : 7p
            onSettled: () => {
                queryUser.refetch()
            }
        })
        console.log("_id" ,{ids});
    }


    const handleCloseDrawer = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
        setIsOpenDrawer(false);
    };


    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success("Delete user success")
            handleCancelDelete()
        } else if (dataDeleted?.status === 'ERR') {
            message.error("User is not exists")
        }
    }, [isSuccessDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success("Delete Users success")
        } else if (dataDeletedMany?.status === 'ERR') {
            message.error("Users is not exists")
        }
    }, [isSuccessDeletedMany])

    useEffect(() => {
        if (isSuccessUpdated && dataUpdate?.status === 'OK') {
            message.success("Update user success")
            handleCloseDrawer()
        } else if (dataUpdate?.status === 'ERR') {
            message.error("Something wrong")
        }
    }, [isSuccessUpdated])


    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const handleChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            // dung de refresh table 41 : 7p
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }


    return (
        <div>
            <WrapperHeader>User Management</WrapperHeader>
            {/* <div style={{ marginTop: "10px" }}>
                <Button onClick={() => setIsModalOpen(!isModalOpen)} style={{ height: "150px", width: "150px", borderRadius: "6px", borderStyle: "dashed" }}><PlusOutlined style={{ fontSize: "60px" }} /></Button>
            </div> */}
            <div style={{ marginTop: "20px" }}>
                <TableComponent handleDeleteMany={handleDeleteManyUser} columns={columns} data={dataTable} users={users?.data} isLoading={isLoadingUsers} onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record)
                            setRowSelected(record._id) // lay ra id 
                        }, // click row
                    };
                }} />


            </div>
        
            <DrawerComponent title="User Details" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic" labelCol={{ span: 4, }}
                        wrapperCol={{ span: 20, }}
                        form={form}
                        autoComplete="on"
                        onFinish={onUpdateUser}
                    >
                        <Form.Item label="User name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your user name!', },]}>
                            <InputComponent value={stateUserDetails.name} onChange={handleChangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!', },]}>
                            <InputComponent value={stateUserDetails.email} onChange={handleChangeDetails} name="email" />
                        </Form.Item>
                        {/* <Form.Item label="Admin"
                            name="isAdmin"
                            rules={[{ required: true, message: 'Please input your count in stock!', },]}>
                            <InputComponent value={stateUserDetails.isAdmin} onChange={handleChangeDetails} name="isAdmin" />
                        </Form.Item> */}
                        <Form.Item label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!', },]}>
                            <InputComponent value={stateUserDetails.address} onChange={handleChangeDetails} name="address" />
                        </Form.Item>
                        <Form.Item label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone!', },]}>
                            <InputComponent value={stateUserDetails.phone} onChange={handleChangeDetails} name="phone" />
                        </Form.Item>
                        <Form.Item label="Avatar"
                            name="avatar"
                            rules={[{ required: true, message: 'Please input your Avatar!', },]}>
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
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

            {/* delete user modal */}
            <ModalComponent forceRender title="Delete user" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Are you sure to delete this entry ?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminUser