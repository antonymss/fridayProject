import React, {ChangeEvent, useState} from "react";
import style from "./AddItemModal.module.css";
import {Modal} from "../../../common/Modal/Modal";

type AddItemModalPropsType = {
    inputLabels: Array<'Name: ' | 'Question: ' | 'Answer: '>
    itemToAdd: 'pack' | 'card'
    show: boolean
    setShow: (show: boolean) => void
    onAddBtnClick: (values: Array<string>) => void
}

export const AddItemModal: React.FC<AddItemModalPropsType> = React.memo(({
                                                                             inputLabels,
                                                                             itemToAdd,
                                                                             show,
                                                                             setShow,
                                                                             onAddBtnClick
                                                                         }) => {
    //создаем массив initialValues с пустыми строками, кол-во которых совпадает с кол-вом лейблов в inputLabels
    const initialValues = Array.from(inputLabels, () => "")
    const [values, setValues] = useState<Array<string>>(initialValues)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        let valuesCopy = [...values]
        setValues(valuesCopy.map((v, i) => i === index ? e.currentTarget.value : v))
    }
    const onAddClick = () => {
        onAddBtnClick(values)
        setShow(false)
    }

    return <Modal enableBackground modalHeightPx={250} modalWidthPx={395} show={show}
                  backgroundOnClick={() => setShow(false)}>
        <div className={style.addBlock}>
            <h4>Add new {itemToAdd}:</h4>
            {inputLabels.map((l, i) => <div>
                <label>{l}<input value={values[i]} onChange={(e) => onChangeHandler(e, i)}/></label>
            </div>)}
            <div className={style.buttons}>
                <button onClick={() => setShow(false)}>Cancel</button>
                <button onClick={onAddClick}>Add</button>
            </div>
        </div>
    </Modal>
})
