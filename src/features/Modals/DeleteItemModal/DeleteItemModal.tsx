import React from "react";
import style from "./DeleteItemModal.module.css";
import {Modal} from "../../../common/Modal/Modal";

type DeleteItemModalPropsType = {
    itemToDelete: 'pack' | 'card'
    show: boolean
    setShow: (show: boolean) => void
    onDeleteBtnClick: (isToBeDeleted: boolean) => void
}

export const DeleteItemModal: React.FC<DeleteItemModalPropsType> = React.memo(({
                                                                                   itemToDelete,
                                                                                   show,
                                                                                   setShow,
                                                                                   onDeleteBtnClick
                                                                               }) => {

    return <Modal enableBackground modalHeightPx={250} modalWidthPx={395} show={show}
                  backgroundOnClick={() => setShow(false)}>
        <div className={style.deleteBlock}>
            <h4>Are you sure you want to delete this {itemToDelete}?</h4>
            <div className={style.buttons}>
                <button onClick={() => onDeleteBtnClick(true)}>Yes</button>
                <button onClick={() => setShow(false)}>No</button>
            </div>
        </div>
    </Modal>
})
