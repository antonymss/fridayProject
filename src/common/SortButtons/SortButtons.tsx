import React from "react";
import {SortDirections} from "../../api/api";

type SortButtonsProps = {
    onClick: (sortDirection: SortDirections) => void //сообщаем родителю направление сортировки
}

export const SortButtons = React.memo(({onClick}: SortButtonsProps) => {

    const onUpClick = () => {
        onClick(SortDirections.Up)
    }
    const onDownClick = () => {
        onClick(SortDirections.Down)
    }

    return <span style={{margin: '0 5px'}}>
        <div>
            <button onClick={onUpClick}>↑</button>
        </div>
        <div>
            <button onClick={onDownClick}>↓</button>
        </div>
    </span>
})