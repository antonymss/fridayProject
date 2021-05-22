import {Pagination} from 'antd';
import React from 'react';

type PaginatorType = {
    onChange: (page: number, pageCount: number | undefined, packId?: string) => void
    current: number
    total: number

}

export const Paginator = (props: PaginatorType) => {

    return <div>
        <Pagination showQuickJumper current={props.current} total={props.total} onChange={props.onChange}/>

    </div>

}
