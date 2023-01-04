import { Divider, Radio, Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/Loading';


const TableComponent = (props) => {
    //#39 : 13p truyen product qua 
    const { selectionType = 'checkbox', products = [], isLoading = false, data = [], columns = [] } = props

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    // console.log(data);

    // const [selectionType, setSelectionType] = useState('checkbox');
    return (
        <div>
            <Loading isLoading={isLoading}>
                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    {...props}
                />
            </Loading>
        </div>
    )
}

export default TableComponent