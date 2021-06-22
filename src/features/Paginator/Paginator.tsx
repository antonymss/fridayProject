import {Pagination} from 'antd';
import React from 'react';
import {RequestStatusType} from "../Login/auth-reducer";

type PaginatorType = {
    onChange: (page: number, pageCount: number | undefined, packId?: string) => void
    current: number
    total: number
    pageCount: number
    requestStatus: RequestStatusType
}

export const Paginator = (props: PaginatorType) => {

    return <div>
        <Pagination showQuickJumper current={props.current} total={props.total} onChange={props.onChange}
                    pageSize={props.pageCount} disabled={props.requestStatus === 'loading'}
                    pageSizeOptions={["5", "10", "20", "50", "100"]}/>
    </div>

}
