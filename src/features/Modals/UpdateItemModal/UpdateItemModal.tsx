import React, {ChangeEvent, useState} from "react";
import {Modal} from "../../../common/Modal/Modal";
import style from "./UpdateItemModal.module.css";

type UpdateItemModalPropsType = {
    inputValues: Array<string>
    inputLabels: Array<'Name: ' | 'Question: ' | 'Answer: '>
    itemToUpdate: 'pack' | 'card'
    show: boolean
    setShow: (show: boolean) => void
    onUpdateBtnClick: (values: Array<string>) => void
}

export const UpdateItemModal: React.FC<UpdateItemModalPropsType> = React.memo(({
                                                                                   inputValues,
                                                                                   inputLabels,
                                                                                   itemToUpdate,
                                                                                   show,
                                                                                   setShow,
                                                                                   onUpdateBtnClick
                                                                               }) => {

    const [values, setValues] = useState<Array<string>>(inputValues)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        let valuesCopy = [...values]
        setValues(valuesCopy.map((v, i) => i === index ? e.currentTarget.value : v))
    }
    const onUpdateClick = () => {
        onUpdateBtnClick(values)
        setShow(false)
    }

    return <Modal enableBackground modalHeightPx={250} modalWidthPx={395} show={show}
                  backgroundOnClick={() => setShow(false)}>
        <div className={style.updateBlock}>
            <h4>Update {itemToUpdate}:</h4>
            <div>
                {inputLabels.map((l, i) => <div>
                    <label>{l}<input value={values[i]} onChange={(e) => onChangeHandler(e, i)}/></label>
                </div>)}
            </div>
            <div className={style.buttons}>
                <button onClick={() => setShow(false)}>Cancel</button>
                <button onClick={onUpdateClick}>Update</button>
            </div>
        </div>
    </Modal>
})
