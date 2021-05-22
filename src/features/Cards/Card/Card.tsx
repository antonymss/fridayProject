import React from "react";
import {CardDataType} from "../../../api/api";
import {useDispatch} from "react-redux";
import style from "./Card.module.css";
import {deleteCardTC, updateCardTC} from "../cards-reducer";

type CardPropsType = {
    card: CardDataType
    packId: string
    authUserId: string
}
export const Card = ({packId, card, authUserId}: CardPropsType) => {
    const dispatch = useDispatch()

    const onDeleteClick = () => {
        dispatch(deleteCardTC(packId, card._id))
    }

    const onUpdateClick = () => {
        dispatch(updateCardTC(packId, card._id))
    }

    return <tr className={style.row}>
        <td>{card.question}</td>
        <td>{card.answer}</td>
        <td>{card.grade}</td>
        <td>{card.updated}</td>
        <td>{card.cardsPack_id}</td>
        <td>
            <button onClick={onDeleteClick} disabled={card.user_id !== authUserId}>Delete
            </button>
            <button onClick={onUpdateClick} disabled={card.user_id !== authUserId}>Update
            </button>
        </td>
    </tr>
}