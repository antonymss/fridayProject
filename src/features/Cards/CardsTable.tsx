import {CardDataType} from "../../api/api";
import {useDispatch} from "react-redux";
import {ColumnsType} from "antd/es/table/interface";
import {Button, Table} from "antd";
import {DeleteTwoTone, EditTwoTone, PlusSquareTwoTone} from '@ant-design/icons';
import React, {useCallback, useState} from "react";
import {addCardTC, deleteCardTC, updateCardTC} from "./cards-reducer";
import {RequestStatusType} from "../Login/auth-reducer";
import {DeleteItemModal} from "../Modals/DeleteItemModal/DeleteItemModal";
import style from "../Learn/Learn.module.css";
import {InputModal, UploadedImageDataType} from "../Modals/InputModal/InputModal";

type CardsTablePropsType = {
    cards: Array<CardDataType>
    packId: string
    packUserId: string
    authUserId: string
    requestStatus: RequestStatusType
}
type ButtonsDataType = {
    cardId: string
    question: string
    answer: string
    questionImg: string
    answerImg: string
}

export type CardType = {
    key: string
    question: string
    questionImg: string
    answer: string
    answerImg: string
    grade: number
    updated: Date
    packId: string
    buttons: ButtonsDataType
}

export const CardsTable = React.memo(({cards, packId, packUserId, authUserId, requestStatus}: CardsTablePropsType) => {
    const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false)
    const [currentCardID, setCurrentCardID] = useState<string>("")
    const [question, setQuestion] = useState<string>("")
    const [answer, setAnswer] = useState<string>("")
    const [questionImg, setQuestionImg] = useState<string>("")
    const [answerImg, setAnswerImg] = useState<string>("")
    const [showUpdateItemModal, setShowUpdateItemModal] = useState<boolean>(false)
    const [showDeleteItemModal, setShowDeleteItemModal] = useState<boolean>(false)
    const dispatch = useDispatch()

    const onAddCardClick = useCallback((values: Array<string>, fileData: Array<UploadedImageDataType>) => {
        //values содержатся в массиве в том порядке, в котором передаем inputLabels в AddItemModal
        dispatch(addCardTC(packId, {
            question: values[0],
            answer: values[1],
            questionImg: fileData[0].base64,
            answerImg: fileData[1].base64
        }))
    }, [dispatch, packId])

    const onDeleteClick = useCallback((isToBeDeleted: boolean) => {
        if (isToBeDeleted) {
            dispatch(deleteCardTC(packId, currentCardID))
            setShowDeleteItemModal(false)
        }
    }, [dispatch, packId, currentCardID])

    const onUpdateClick = useCallback((values: Array<string>, fileData: Array<UploadedImageDataType>) => {
        //values содержатся в массиве в том порядке, в котором передаем inputLabels и inputValues в UpdateItemModal
        dispatch(updateCardTC(packId, currentCardID, {
            question: values[0],
            answer: values[1],
            questionImg: fileData[0].base64,
            answerImg: fileData[1].base64
        }))
    }, [dispatch, packId, currentCardID])
//мапим данные для таблицы:
    const data: Array<CardType> = cards.map(c => ({
        key: c._id,
        question: c.question,
        questionImg: c.questionImg,
        answer: c.answer,
        answerImg: c.answerImg,
        grade: c.grade,
        updated: c.updated,
        packId: c.cardsPack_id,
        buttons: {
            cardId: c._id,
            question: c.question,
            answer: c.answer,
            questionImg: c.questionImg,
            answerImg: c.answerImg
        }
    }))
// колонки (их заголовки и render в тех колонках, где надо отрисовывать элементы в таблице):
    const columns: ColumnsType<CardType> = [
        {title: 'Question', dataIndex: 'question', key: 'question'},
        {
            title: 'Question Pic', dataIndex: 'questionImg ', key: 'questionImg ',
            render: (text, record) => <div className={style.questionImg}
                                           style={{backgroundImage: `url(${record.questionImg})`}}>
            </div>
        },
        {title: 'Answer', dataIndex: 'answer', key: 'answer'},
        {
            title: 'Answer Pic', dataIndex: 'answerImg ', key: 'answerImg ',
            render: (text, record) => <div className={style.answerImg}
                                           style={{backgroundImage: `url(${record.answerImg})`}}>
            </div>
        },
        {title: 'Grade', dataIndex: 'grade', key: 'grade'},
        {title: 'Last Update', dataIndex: 'updated', key: 'updated'},
        {title: 'Pack ID', dataIndex: 'packId', key: 'packId'},


        {
            title: () => <>
                {packUserId === authUserId &&
                <Button onClick={() => setShowAddItemModal(true)} type={'ghost'} size={'large'}
                        icon={<PlusSquareTwoTone style={{fontSize: '16px'}}/>}/>
                }
            </>,
            dataIndex: 'buttons',
            key: 'buttons',
            render: ({cardId, question, answer, questionImg, answerImg}: ButtonsDataType) => <>
                {packUserId === authUserId && <>
                    <Button onClick={() => {
                        setCurrentCardID(cardId)
                        setShowDeleteItemModal(true)
                    }} icon={<DeleteTwoTone style={{fontSize: '16px'}}/>} shape="circle" ghost/>
                    <Button onClick={() => {
                        setCurrentCardID(cardId)
                        setQuestion(question)
                        setAnswer(answer)
                        setQuestionImg(questionImg)
                        setAnswerImg(answerImg)
                        setShowUpdateItemModal(true)
                    }} icon={<EditTwoTone style={{fontSize: '16px'}}/>} shape="circle" ghost/>
                </>}
            </>,
        },
    ];

    return <>
        <Table columns={columns} dataSource={data} pagination={false} style={{width: '100%'}}
               size={'small'} loading={requestStatus === 'loading'} tableLayout={'fixed'}/>
        {/*модалка для добавления карточки*/}
        {showAddItemModal &&
        <InputModal action={'add'} show={showAddItemModal} setShow={setShowAddItemModal}
                    inputLabels={["question", "answer"]} onSubmitClick={onAddCardClick}
                    itemToInput={'card'} filesToUpload={['question pic', 'answer pic']}/>}
        {/*модалка для удаления карточки*/}
        {showDeleteItemModal && <DeleteItemModal show={showDeleteItemModal} setShow={setShowDeleteItemModal}
                                                 itemToDelete={'pack'} onDeleteBtnClick={onDeleteClick}/>}
        {/*модалка для редактирования карточки*/}
        {showUpdateItemModal &&
        <InputModal action={'update'} show={showUpdateItemModal} setShow={setShowUpdateItemModal}
                    itemToInput={'card'} onSubmitClick={onUpdateClick}
                    filesToUpload={['question pic', 'answer pic']}
                    imageURLs={[questionImg, answerImg]} inputLabels={["question", "answer"]}
                    inputValues={[question, answer]}/>}
    </>
})