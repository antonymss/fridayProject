import React, {useCallback, useState} from "react";
import {Slider} from 'antd';
import style from "./DoubleRange.module.css";

type DoubleRangePropsType = {
    minRangeLimit?: number
    maxRangeLimit?: number
    minValue: number | undefined
    maxValue: number | undefined
    onValuesChange: ([minValue, maxValue]: Array<number | undefined>) => void
}
export const DoubleRange = React.memo(({
                                           minRangeLimit = 0,
                                           maxRangeLimit = 100,
                                           minValue,
                                           maxValue,
                                           onValuesChange
                                       }: DoubleRangePropsType) => {

    const [min, setMin] = useState(minValue || 0)
    const [max, setMax] = useState(maxValue || 5)

    const onSliderValuesChange = useCallback((values: Array<number>) => {
        setMin(values[0])
        setMax(values[1])
    }, [setMin, setMax])

    const onMouseUpHandler = useCallback(() => {
        onValuesChange([min, max])
    }, [onValuesChange, min, max])

    return <span className={style.rangeBlock}>
        <Slider range={{draggableTrack: true}} value={[min, max]} min={minRangeLimit} max={maxRangeLimit}
                onChange={onSliderValuesChange}
                onAfterChange={onMouseUpHandler}
                tooltipVisible
        />
    </span>
})