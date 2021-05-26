import {CardDataType, SortDirections} from "../../api/api";
import {useDispatch} from "react-redux";
import {ColumnsType, FilterValue} from "antd/es/table/interface";
import {Table, TablePaginationConfig} from "antd";
import {SorterResult} from "antd/lib/table/interface";
import React, {useState} from "react";
import {addCardTC, deleteCardTC, getCardsTC, updateCardTC} from "./cards-reducer";
import {RequestStatusType} from "../Login/auth-reducer";
import {AddItemModal} from "../Modals/AddItemModal/AddItemModal";
import {UpdateItemModal} from "../Modals/UpdateItemModal/UpdateItemModal";
import {DeleteItemModal} from "../Modals/DeleteItemModal/DeleteItemModal";

type CardsTablePropsType = {
    cards: Array<CardDataType>
    packId: string
    packUserId: string
    authUserId: string
    requestStatus: RequestStatusType
}
type CardIdsType = {
    cardId: string
    cardUserId: string
    question: string
    answer: string
}
type CardType = {
    key: string
    question: string
    answer: string
    grade: number
    updated: Date
    packId: string
    buttons: CardIdsType
}

export const CardsTable = React.memo(({cards, packId, packUserId, authUserId, requestStatus}: CardsTablePropsType) => {
    const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false)
    const [currentCardID,setCurrentCardID] = useState<string>("")
    const [question,setQuestion] = useState<string>("")
    const [answer,setAnswer] = useState<string>("")
    const [showUpdateItemModal, setShowUpdateItemModal] = useState<boolean>(false)
    const [showDeleteItemModal, setShowDeleteItemModal] = useState<boolean>(false)
    const dispatch = useDispatch()

    const onAddCardClick = (values: Array<string>) => {
        //values содержатся в массиве в том порядке, в котором передаем inputLabels в ScrollUpModal
        dispatch(addCardTC(packId, {question: values[0], answer: values[1]}))
    }

    const onDeleteClick = (isToBeDeleted: boolean) => {
        if (isToBeDeleted){
            dispatch(deleteCardTC(packId, currentCardID))
            setShowDeleteItemModal(false)
        }

    }

    const onUpdateClick = (values: Array<string>) => {
        dispatch(updateCardTC (packId, currentCardID, {question: values[0], answer: values[1]}))
    }



    const data: Array<CardType> = cards.map(c => ({
        key: c._id,
        question: c.question,
        answer: c.answer,
        grade: c.grade,
        updated: c.updated,
        packId: c.cardsPack_id,
        buttons: {cardId: c._id, cardUserId: c.user_id, question: c.question, answer: c.answer}
    }))

    const columns: ColumnsType<CardType> = [
        {title: 'Question', dataIndex: 'question', key: 'question'},
        {title: 'Answer', dataIndex: 'answer', key: 'answer'},
        {title: 'Grade', dataIndex: 'grade', key: 'grade', sorter: true},
        {title: 'Last Update', dataIndex: 'updated', key: 'updated'},
        {title: 'Pack ID', dataIndex: 'packId', key: 'packId'},
        {
            title: () => <button onClick={() => setShowAddItemModal(true)} disabled={packUserId !== authUserId}>Add</button>,
            dataIndex: 'buttons',
            key: 'buttons',
            render: ({cardId, cardUserId, question, answer}: CardIdsType) => <>
                <button onClick={() => {
                    setCurrentCardID(cardId);
                    setShowDeleteItemModal(true)
                }} disabled={cardUserId !== authUserId}>Delete</button>
                <button onClick={() => {
                    setCurrentCardID(cardId);
                    setQuestion(question);
                    setAnswer(answer)
                    setShowUpdateItemModal(true)
                }} disabled={packUserId !== authUserId}>Update
                </button>
            </>,
        },
    ];

    const onChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>,
                      sorter: SorterResult<CardType> | any) => {
        if (sorter.columnKey === 'grade' && sorter.order === 'ascend') {
            dispatch(getCardsTC(packId, {sortDirection: SortDirections.Down, propToSortBy: "grade"}))
        } else if (sorter.columnKey === 'grade' && sorter.order === 'descend') {
            dispatch(getCardsTC(packId, {sortDirection: SortDirections.Up, propToSortBy: "grade"}))
        } else if (sorter.columnKey === 'grade' && sorter.order === undefined) {
            dispatch(getCardsTC(packId, {sortDirection: SortDirections.Up, propToSortBy: "updated"}))
        }
    }

    return <>
        <Table columns={columns} dataSource={data} onChange={onChange} pagination={false} style={{width: '100%'}}
               size={'small'} loading={requestStatus === 'loading'}/>
        {showAddItemModal &&
        <AddItemModal show={showAddItemModal} setShow={setShowAddItemModal} inputLabels={["Question: ", "Answer: "]}
                      itemToAdd={'card'} onAddBtnClick={onAddCardClick}/>}
        {showDeleteItemModal && <DeleteItemModal show={showDeleteItemModal} setShow={setShowDeleteItemModal}
                                                 itemToDelete={'pack'} onDeleteBtnClick={onDeleteClick}/>}

        {showUpdateItemModal && <UpdateItemModal show={showUpdateItemModal} setShow={setShowUpdateItemModal}
                                                 itemToUpdate={'card'} onUpdateBtnClick={onUpdateClick}
                                                 inputLabels={["Question: ", "Answer: "]} inputValues={[question, answer]}/>}
    </>
})