import React, {ChangeEvent, MouseEventHandler, useEffect, useState} from "react";
import style from "./DoubleRange.module.css";

type DoubleRangePropsType = {
    minRangeLimit?: string
    maxRangeLimit: string
    minValue: string | undefined
    maxValue: string | undefined
    onValuesChange: ([minValue, maxValue]: Array<string | undefined>) => void
}
export const DoubleRange = React.memo(({
                                           minRangeLimit = '0',
                                           maxRangeLimit,
                                           minValue,
                                           maxValue,
                                           onValuesChange
                                       }: DoubleRangePropsType) => {

    const [min, setMin] = useState(minValue || '0')
    const [max, setMax] = useState(maxValue || '5')

    useEffect(() => {
        if (min === max) {
            setMin((+min - 1).toString())
            setMax((+max + 1).toString())
        }
    }, [min, max, maxRangeLimit])

    const onRangeValuesChange = () => {
        onValuesChange([min, max])
    }

    return <>
        <div className={style.rangeBlock}>
            {min}
            <span className={style.doubleRange} onMouseUp={onRangeValuesChange}>
                    <input type="range" min={minRangeLimit} value={min} onChange={e => setMin(e.currentTarget.value)}
                           max={maxRangeLimit}/>
                    <input type="range" min={minRangeLimit} value={max} onChange={e => setMax(e.currentTarget.value)}
                           max={maxRangeLimit}/>
                </span>
            {max}
        </div>
    </>
})