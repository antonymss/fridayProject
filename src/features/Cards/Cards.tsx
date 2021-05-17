import React, {KeyboardEvent, useCallback, useEffect, useState} from "react";
import style from "./Cards.module.css";
import {Redirect, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {SortButtons} from "../../common/SortButtons/SortButtons";
import {CardDataType, GetSortedCardsType, SortDirections} from "../../api/api";
import {DoubleRange} from "../../common/DoubleRange/DoubleRange";
import {addCardTC, CardsStateType, getCardsTC} from "./cards-reducer";
import {Paginator} from "../Paginator/Paginator";
import {PATH} from "../../app/App";
import {Card} from "./Card/Card";


export const Cards = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const authUserId = useSelector<AppRootStateType, string>(state => state.auth._id)
    const cards = useSelector<AppRootStateType, Array<CardDataType>>(state => state.cards.cards)
    const packUserId = useSelector<AppRootStateType, string>(state => state.cards.packUserId)
    const {packId} = useParams<{ packId?: any }>()    //читаем id колоды из URL
    const error = useSelector<AppRootStateType, string>(state => state.cards.error)
    const {minGrade, maxGrade} = useSelector<AppRootStateType, GetSortedCardsType>(state => state.cards.sortParams)
    const {cardsTotalCount, page} = useSelector<AppRootStateType, CardsStateType>(state => state.cards)
    const dispatch = useDispatch()

    const [answer, setAnswer] = useState<string>("")
    const [question, setQuestion] = useState<string>("")

    useEffect(() => {
        if (isLoggedIn && packId) dispatch(getCardsTC(packId))   //запрашиваем карточки, если залогинен и есть packId
    }, [])

    const onSortByGrade = useCallback((sortDirection: SortDirections) => {
        dispatch(getCardsTC(packId, {sortDirection, propToSortBy: "grade"}))
    }, [packId, dispatch])

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
    const onAddBtnClick = (packId: string) => {
        dispatch(addCardTC(packId))
    }
    const paginatorPage = useCallback((page: number, pageCount: number | undefined) => {
        dispatch(getCardsTC(packId, {page, pageCount}))
    }, [packId, dispatch])

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>
    if (isLoggedIn && !packId) return <Redirect to={PATH.PACKS}/>

    return (
        <div className={style.cards}>
            <h2>Cards</h2>
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
                <div style={{display: "flex"}}>Search cards by grade:
                    <DoubleRange minValue={minGrade} maxValue={maxGrade} onValuesChange={onGradeRangeChange}
                                 maxRangeLimit={5}/></div>
            </div>
            {error && <div style={{color: 'red', margin: '0 auto'}}>{error}</div>}
            <table width="100%" cellPadding="4" className={style.table}>
                <thead style={{outline: 'medium solid'}}>
                <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>
                        <div className={style.cellWithButtons}>Grade<SortButtons onClick={onSortByGrade}/></div>
                    </th>
                    <th>Last Update</th>
                    <th>Pack ID</th>
                    <th>
                        <button onClick={() => {
                            onAddBtnClick(packId)
                        }} disabled={packUserId !== authUserId}>Add
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {/*мапим карточки, чтобы они появились в таблице*/}
                {cards.map(c => <Card key={c._id} card={c} packId={packId} authUserId={authUserId}/>)}
                </tbody>
            </table>
            {/*Pagination*/}
            <div className={style.pagination}>
                <Paginator current={page}
                           total={cardsTotalCount}
                           onChange={paginatorPage}/>
            </div>
        </div>
    );
}