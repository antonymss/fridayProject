import {NavLink} from "react-router-dom";
import React from "react";
import {PackDataType} from "../../../api/api";
import {useDispatch} from "react-redux";
import {deletePackTC, updatePackTC} from "../packs-reducer";
import style from "./Pack.module.css";

type PackPropsType = {
    pack: PackDataType
    authUserId: string
}
export const Pack = ({pack, authUserId}: PackPropsType) => {
    const dispatch = useDispatch()

    const onDeleteClick = () => {
        dispatch(deletePackTC(pack._id))
    }

    const onUpdateClick = () => {
        dispatch(updatePackTC(pack._id))
    }

    return <tr className={style.row}>
        <td>{pack.name}</td>
        <td>{pack.cardsCount}</td>
        <td>{pack.updated}</td>
        <td>{pack.user_name}</td>
        <td>
            <button onClick={onDeleteClick} disabled={pack.user_id !== authUserId}>Delete</button>
            <button onClick={onUpdateClick} disabled={pack.user_id !== authUserId}>Update</button>
            <NavLink to={`/cards/${pack._id}`} activeClassName={style.active}>Cards</NavLink>
        </td>
    </tr>
}