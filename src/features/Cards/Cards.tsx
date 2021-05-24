import React, {KeyboardEvent, useCallback, useEffect, useState} from "react";
import style from "./Cards.module.css";
import {NavLink, Redirect, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {GetSortedCardsType, PackDataType} from "../../api/api";
import {DoubleRange} from "../../common/DoubleRange/DoubleRange";
import {CardsStateType, getCardsTC, setCardsAC} from "./cards-reducer";
import {Paginator} from "../Paginator/Paginator";
import {PATH} from "../../app/App";
import {CardsTable} from "./CardsTable";
import commonStyle from "../../common/styles/error.module.css";


export const Cards = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const authUserId = useSelector<AppRootStateType, string>(state => state.auth._id)
    const {packId} = useParams<{ packId?: any }>()    //читаем id колоды из URL
    const {minGrade, maxGrade} = useSelector<AppRootStateType, GetSortedCardsType>(state => state.cards.sortParams)
    const {
        cards,
        packUserId,
        cardsTotalCount,
        page,
        pageCount,
        error,
        requestStatus
    } = useSelector<AppRootStateType, CardsStateType>(state => state.cards)
    const packs = useSelector<AppRootStateType, Array<PackDataType>>(state => state.packs.cardPacks)
    const dispatch = useDispatch()

    const [answer, setAnswer] = useState<string>("")
    const [question, setQuestion] = useState<string>("")

    useEffect(() => {
        if (isLoggedIn && packId) dispatch(getCardsTC(packId))   //запрашиваем карточки, если залогинен и есть packId
        //зачищаем карточки при выходе со страницы Cards, чтобы во время запроса новых карточек в Cards не просвечивались старые
        return () => {
            dispatch(setCardsAC([], "", 1, 0, 10))
        }
    }, [])

    const onGradeRangeChange = useCallback(([minValue, maxValue]: Array<number | undefined>) => {
        dispatch(getCardsTC(packId, {minGrade: minValue, maxGrade: maxValue}))
    }, [packId, dispatch])

    const onSearchByQuestion = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            dispatch(getCardsTC(packId, {question: question}))
        }
    }
    const onSearchByAnswer = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            dispatch(getCardsTC(packId, {answer: answer}))
        }
    }
    const paginatorPage = useCallback((page: number, pageCount: number | undefined) => {
        dispatch(getCardsTC(packId, {page, pageCount}))
    }, [packId, dispatch])
    //защита от попытки открыть Learn с выдуманным packId в url
    let isPackFound = packs.some(p => p._id === packId)

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>
    if (isLoggedIn && !packId || isLoggedIn && !isPackFound) return <Redirect to={PATH.PACKS}/>

    return (
        <div className={style.cards}>
            <h2><NavLink to={PATH.PACKS} activeClassName={style.active}>⏴ Packs</NavLink></h2>
            <div className={style.filter}>
                {/*фильтр карточек по вопросу*/}
                <label>Search cards by question: <input placeholder={'Press Enter to search'}
                                                        onKeyPress={onSearchByQuestion}
                                                        value={question}
                                                        onChange={e => setQuestion(e.currentTarget.value)}/></label>
                {/*фильтр карточек по ответу*/}
                <label>Search cards by answer: <input placeholder={'Press Enter to search'}
                                                      onKeyPress={onSearchByAnswer}
                                                      value={answer}
                                                      onChange={e => setAnswer(e.currentTarget.value)}/></label>
                {/*двойной range для сортировки по оценкам (grade)*/}
                <div className={style.rangeContainer}>Search cards by grade:
                    <DoubleRange minValue={minGrade} maxValue={maxGrade} onValuesChange={onGradeRangeChange}
                                 maxRangeLimit={5}/></div>
            </div>
            <div className={error && commonStyle.error}>{error}</div>
            {/*таблица с карточками*/}
            <CardsTable cards={cards} packId={packId} packUserId={packUserId} authUserId={authUserId} requestStatus={requestStatus}/>
            {/*Pagination*/}
            <div className={style.pagination}>
                <Paginator current={page}
                           pageCount={pageCount}
                           total={cardsTotalCount}
                           onChange={paginatorPage}
                           requestStatus={requestStatus}/>
            </div>
        </div>
    );
}