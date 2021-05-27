import React, {useEffect, useState} from "react";
import {Modal} from "../../../common/Modal/Modal";

type ScrollUpModalPropsType = {}

export const ScrollUpModal: React.FC<ScrollUpModalPropsType> = React.memo(({}) => {
    const [show, setShow] = useState(false)
    let scrollSpeed = 10 // пауза между интервалами: 50мс, поэтому 10 здесь означает, что полный скролл займёт 500мс (полсекунды)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    }, [])

    const handleScroll = () => { //условия появления модалки
        if (window.pageYOffset > 400) {
            setShow(true)
        } else {
            setShow(false)
        }
    }

    const scroll = () => {
        const singleScrollLength = window.pageYOffset / scrollSpeed //отрезок, проскролленый за 1 интервал (ниже)
        let lastScrollPosition = window.pageYOffset // позиция скролла во время предыдущего интервала (ниже)

        const timer = setInterval(() => {
            if (lastScrollPosition < window.pageYOffset) { //остановить скролл, если юзер скроллит вниз во время скролла вверх
                clearInterval(timer)
            } else {
                lastScrollPosition = window.pageYOffset //иначе обновляем значение предыдущей позиции скролла
            }

            window.scroll(0, lastScrollPosition - singleScrollLength) //скроллим на 1 отрезок вверх
            if (window.pageYOffset === 0) clearInterval(timer) //остановить скролл, если находимся в самом верху
        }, 50)
    }

    return <Modal enableBackground={false} modalHeightPx={50} modalWidthPx={50} show={show}
                  modalOnClick={scroll} modalStyle={{
        top: '85vh',
        left: '60px',
        border: '1px solid #d9d9d9',
        borderRadius: '2px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        boxShadow: '5px 5px 5px grey',
        opacity: '0.5',
        cursor: 'pointer'
    }}>
        <h2>⏶</h2>
    </Modal>
})
