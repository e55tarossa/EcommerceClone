import { Button, Divider, Dropdown, Radio, Space, Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import ModalComponent from '../ModalComponent/ModalComponent';
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from 'react';


const TableComponent = (props) => {
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const [isModalOpenDeleteAll, setIsModalOpenDeleteAll] = useState(false)
    //#39 : 13p truyen product qua 
    const { selectionType = 'checkbox', products = [], isLoading = false, data: dataSource = [], columns = [], handleDeleteMany } = props

    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== "action")
        return arr
    },[columns])
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
            // console.log(`selectedRowKeys: ${selectedRowKeys}` //id row
            // 'selectedRows: ' selectedRows //nguyen 1 array co du lieu 
        }
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };

    // console.log(data); array of data []

    // const [selectionType, setSelectionType] = useState('checkbox');

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            icon: <SmileOutlined />,
            disabled: true,
        },
        {
            key: '4',
            danger: true,
            label: 'a danger item',
        },
    ];

    const handleDeleteAll = () => {
        // handleDelteMany(rowSelectedKeys)\
        handleDeleteMany(rowSelectedKeys)
        setIsModalOpenDeleteAll(false)
    }

    const handleCancelDeleteAll = () => {
        setIsModalOpenDeleteAll(false)
    }

    const exportExcel = () => {
        const excel = new Excel();
        excel.addSheet("test").addColumns(newColumnExport).addDataSource(dataSource, {str2Percent: true}).saveAs("Excel.xlsx")
    }

    return (
        <div>
            <Loading isLoading={isLoading}>
                <Button onClick={exportExcel}>Export</Button>
                {/* <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Hover me
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown> */}
                {rowSelectedKeys.length > 0 && (
                    <div style={{
                        background: 'red',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '10px',
                        margin: "10px 0px",
                        cursor: 'pointer'
                    }}
                        onClick={() => setIsModalOpenDeleteAll(true)}
                    >
                       Delete all selected
                    </div>
                )}
                <ModalComponent forceRender title="Delete product list" open={isModalOpenDeleteAll} onCancel={handleCancelDeleteAll} onOk={handleDeleteAll} >
                        <div>Are you sure to delete this entry ?</div>
                </ModalComponent>
                
                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    {...props}
                />
            </Loading>
        </div>
    )
}

export default TableComponent