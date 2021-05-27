import {PackDataType, SortDirections} from "../../api/api";
import {useDispatch} from "react-redux";
import {addPackTC, deletePackTC, getPacksTC, updatePackTC} from "./packs-reducer";
import {ColumnsType, FilterValue} from "antd/es/table/interface";
import {NavLink} from "react-router-dom";
import {Table, TablePaginationConfig} from "antd";
import {SorterResult} from "antd/lib/table/interface";
import React, {useState} from "react";
import {RequestStatusType} from "../Login/auth-reducer";
import {AddItemModal} from "../Modals/AddItemModal/AddItemModal";
import {PATH} from "../../app/App";
import {DeleteItemModal} from "../Modals/DeleteItemModal/DeleteItemModal";
import {UpdateItemModal} from "../Modals/UpdateItemModal/UpdateItemModal";

type PacksTablePropsType = {
    cardPacks: Array<PackDataType>
    authUserId: string
    requestStatus: RequestStatusType
}
type ButtonsDataType = {
    packId: string
    packUserId: string
    cardsCount: number
    packName: string
}
type PackType = {
    key: string,
    name: string,
    cardsCount: number,
    updated: Date,
    createdBy: string,
    buttons: ButtonsDataType
}
export const PacksTable = React.memo(({cardPacks, authUserId, requestStatus}: PacksTablePropsType) => {
    const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false)
    const [showDeleteItemModal, setShowDeleteItemModal] = useState<boolean>(false)
    const [showUpdateItemModal, setShowUpdateItemModal] = useState<boolean>(false)
    const [currentPackID, setCurrentPackID] = useState<string>('')
    const [currentPackName, setCurrentPackName] = useState<string>('')
    const dispatch = useDispatch()

    const onAddPackClick = (values: Array<string>) => {
        //values содержатся в массиве в том порядке, в котором передаем inputLabels в ScrollUpModal
        dispatch(addPackTC(values[0]))
    }

    const onDeleteClick = (isToBeDeleted: boolean) => {
        if (isToBeDeleted) {
            dispatch(deletePackTC(currentPackID))
            setShowDeleteItemModal(false)
        }
    }

    const onUpdateClick = (values: Array<string>) => {
        //values содержатся в массиве в том порядке, в котором передаем inputLabels и inputValues в UpdateItemModal
        dispatch(updatePackTC(currentPackID, values[0]))
    }

    const data: Array<PackType> = cardPacks.map(p => ({
        key: p._id,
        name: p.name,
        cardsCount: p.cardsCount,
        updated: p.updated,
        createdBy: p.user_name,
        buttons: {packId: p._id, packUserId: p.user_id, cardsCount: p.cardsCount, packName: p.name}
    }))

    const columns: ColumnsType<PackType> = [
        {title: 'Name', dataIndex: 'name', key: 'name', sorter: true},
        {title: 'Learn Count', dataIndex: 'cardsCount', key: 'cardsCount', sorter: true},
        {title: 'Last Update', dataIndex: 'updated', key: 'updated'},
        {title: 'Created by', dataIndex: 'createdBy', key: 'createdBy'},
        {
            title: () => <button onClick={() => setShowAddItemModal(true)}>Add</button>,
            dataIndex: 'buttons',
            key: 'buttons',
            render: ({packId, packUserId, cardsCount, packName}: ButtonsDataType) => <>
                <button onClick={() => {
                    setCurrentPackID(packId);
                    setShowDeleteItemModal(true)
                }} disabled={packUserId !== authUserId}>Delete
                </button>
                <button onClick={() => {
                    setCurrentPackID(packId);
                    setCurrentPackName(packName);
                    setShowUpdateItemModal(true)
                }} disabled={packUserId !== authUserId}>Update
                </button>
                <span><NavLink to={PATH.CARDS + "/" + packId}> Cards </NavLink></span>
                {cardsCount > 0 &&
                <span><NavLink to={PATH.LEARN + "/" + packId}> Learn </NavLink></span>}
            </>,
        },
    ];

    const onChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>,
                      sorter: SorterResult<PackType> | any) => {
        if (sorter.columnKey === 'name' && sorter.order === 'ascend') {
            dispatch(getPacksTC({sortDirection: SortDirections.Down, propToSortBy: 'name'}))
        } else if (sorter.columnKey === 'name' && sorter.order === 'descend') {
            dispatch(getPacksTC({sortDirection: SortDirections.Up, propToSortBy: 'name'}))
        } else if (sorter.columnKey === 'name' && sorter.order === undefined) {
            dispatch(getPacksTC({sortDirection: SortDirections.Up, propToSortBy: 'updated'}))
        }
        if (sorter.columnKey === 'cardsCount' && sorter.order === 'ascend') {
            dispatch(getPacksTC({sortDirection: SortDirections.Down, propToSortBy: "cardsCount"}))
        } else if (sorter.columnKey === 'cardsCount' && sorter.order === 'descend') {
            dispatch(getPacksTC({sortDirection: SortDirections.Up, propToSortBy: "cardsCount"}))
        } else if (sorter.columnKey === 'cardsCount' && sorter.order === undefined) {
            dispatch(getPacksTC({sortDirection: SortDirections.Up, propToSortBy: 'updated'}))
        }
    }

    return <>
        <Table columns={columns} dataSource={data} onChange={onChange} pagination={false} style={{width: '100%'}}
               size={'small'} loading={requestStatus === 'loading'}/>
        {/*модалка для добавления колоды*/}
        {showAddItemModal &&
        <AddItemModal show={showAddItemModal} setShow={setShowAddItemModal} inputLabels={["Name: "]}
                      itemToAdd={'pack'} onAddBtnClick={onAddPackClick}/>}
        {/*модалка для удаления колоды*/}
        {showDeleteItemModal && <DeleteItemModal show={showDeleteItemModal} setShow={setShowDeleteItemModal}
                                                 itemToDelete={'pack'} onDeleteBtnClick={onDeleteClick}/>}
        {/*модалка для редактирования колоды*/}
        {showUpdateItemModal && <UpdateItemModal show={showUpdateItemModal} setShow={setShowUpdateItemModal}
                                                 itemToUpdate={'pack'} onUpdateBtnClick={onUpdateClick}
                                                 inputLabels={["Name: "]} inputValues={[currentPackName]}/>}
    </>
})