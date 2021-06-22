import {PackDataType, SortDirections} from "../../api/api";
import {useDispatch} from "react-redux";
import {addPackTC, deletePackTC, getPacksTC, updatePackTC} from "./packs-reducer";
import {ColumnsType, FilterValue} from "antd/es/table/interface";
import {NavLink} from "react-router-dom";
import {Button, Table, TablePaginationConfig} from "antd";
import {DeleteTwoTone, EditTwoTone, PlusSquareTwoTone} from '@ant-design/icons';
import {SorterResult} from "antd/lib/table/interface";
import React, {useCallback, useState} from "react";
import {RequestStatusType} from "../Login/auth-reducer";
import {PATH} from "../../app/App";
import {DeleteItemModal} from "../Modals/DeleteItemModal/DeleteItemModal";
import style from "../Learn/Learn.module.css";
import {InputModal, UploadedImageDataType} from "../Modals/InputModal/InputModal";

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
    deckCover: string
}
type PackType = {
    key: string
    name: string
    deckCover: string
    cardsCount: number
    updated: Date
    createdBy: string
    buttons: ButtonsDataType
}
export const PacksTable = React.memo(({cardPacks, authUserId, requestStatus}: PacksTablePropsType) => {
    const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false)
    const [showDeleteItemModal, setShowDeleteItemModal] = useState<boolean>(false)
    const [showUpdateItemModal, setShowUpdateItemModal] = useState<boolean>(false)
    const [currentPackID, setCurrentPackID] = useState<string>('')
    const [currentPackName, setCurrentPackName] = useState<string>('')
    const [currentPackCover, setCurrentPackCover] = useState<string>('')
    const dispatch = useDispatch()

    const onAddPackClick = useCallback((values: Array<string>, fileData: Array<UploadedImageDataType>) => {
        //values содержатся в массиве в том порядке, в котором передаем inputLabels в AddItemModal
        dispatch(addPackTC(values[0], fileData[0].base64))
    }, [dispatch])

    const onDeleteClick = useCallback((isToBeDeleted: boolean) => {
        if (isToBeDeleted) {
            dispatch(deletePackTC(currentPackID))
            setShowDeleteItemModal(false)
        }
    }, [dispatch, currentPackID])

    const onUpdateClick = useCallback((values: Array<string>, fileData: Array<UploadedImageDataType>) => {
        //values содержатся в массиве в том порядке, в котором передаем inputLabels и inputValues в UpdateItemModal
        dispatch(updatePackTC(currentPackID, {name: values[0], deckCover: fileData[0].base64}))
    }, [dispatch, currentPackID])
//мапим данные для таблицы:
    const data: Array<PackType> = cardPacks.map(p => ({
        key: p._id,
        name: p.name,
        deckCover: p.deckCover,
        cardsCount: p.cardsCount,
        updated: p.updated,
        createdBy: p.user_name,
        buttons: {
            packId: p._id,
            packUserId: p.user_id,
            cardsCount: p.cardsCount,
            packName: p.name,
            deckCover: p.deckCover
        }
    }))
// колонки (их заголовки и render в тех колонках, где надо отрисовывать элементы в таблице):
    const columns: ColumnsType<PackType> = [
        {title: 'Pack Name', dataIndex: 'name', key: 'name', sorter: true},
        {
            title: 'Deck Cover', dataIndex: 'deckCover', key: 'deckCover',
            render: (text, record) => <div className={style.deckCover}
                                           style={{backgroundImage: `url(${record.deckCover})`}}>
            </div>
        },
        {title: 'Cards Count', dataIndex: 'cardsCount', key: 'cardsCount', sorter: true},
        {title: 'Last Update', dataIndex: 'updated', key: 'updated'},
        {title: 'Created by', dataIndex: 'createdBy', key: 'createdBy'},
        {
            title: () => <Button onClick={() => setShowAddItemModal(true)} type={'ghost'} size={'large'}
                                 icon={<PlusSquareTwoTone style={{fontSize: '16px'}}/>}/>,
            dataIndex: 'buttons',
            key: 'buttons',
            render: ({packId, packUserId, cardsCount, packName, deckCover}: ButtonsDataType) => <>
                {packUserId === authUserId && <>
                    <Button onClick={() => {
                        setCurrentPackID(packId)
                        setShowDeleteItemModal(true)
                    }} icon={<DeleteTwoTone style={{fontSize: '16px'}}/>} shape="circle" ghost/>
                    <Button onClick={() => {
                        setCurrentPackID(packId)
                        setCurrentPackName(packName)
                        setCurrentPackCover(deckCover)
                        setShowUpdateItemModal(true)
                    }} icon={<EditTwoTone style={{fontSize: '16px'}}/>} shape="circle" ghost/>
                </>}
                {packUserId === authUserId || cardsCount > 0
                    ? <span><NavLink to={`${PATH.CARDS}/${packId}`}> 👁️ Cards </NavLink></span>
                    : null}
                {cardsCount > 0 &&
                <span><span> | </span><NavLink to={`${PATH.LEARN}/${packId}`}> 🎓 Learn </NavLink></span>}
            </>,
        },
    ];
//диспатч экшенов при сортировке с помощью кнопкок сортировки там, где они есть (Name и Cards Count):
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
               size={'small'} loading={requestStatus === 'loading'} tableLayout={'fixed'}/>
        {/*модалка для добавления колоды*/}
        {showAddItemModal &&
        <InputModal action={'add'} show={showAddItemModal} setShow={setShowAddItemModal} inputLabels={["name"]}
                    itemToInput={'pack'} filesToUpload={['deck cover']} onSubmitClick={onAddPackClick}/>}
        {/*модалка для удаления колоды*/}
        {showDeleteItemModal && <DeleteItemModal show={showDeleteItemModal} setShow={setShowDeleteItemModal}
                                                 itemToDelete={'pack'} onDeleteBtnClick={onDeleteClick}/>}
        {/*модалка для редактирования колоды*/}
        {showUpdateItemModal &&
        <InputModal action={'update'} show={showUpdateItemModal} setShow={setShowUpdateItemModal}
                    itemToInput={'pack'} onSubmitClick={onUpdateClick}
                    filesToUpload={['deck cover']} imageURLs={[currentPackCover]}
                    inputLabels={["name"]} inputValues={[currentPackName]}/>}
    </>
})