import React, {KeyboardEvent, useCallback, useEffect} from "react";
import style from "./Cards.module.css";
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {SortButtons} from "../../common/SortButtons/SortButtons";
import {getAuthUserDataTC} from "../Login/auth-reducer";
import {GetSortedCardsType, SortDirections} from "../../api/api";
import {DoubleRange} from "../../common/DoubleRange/DoubleRange";

export const Cards = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    // const {packId} = useParams<{ packId?: string }>()    //читаем id колоды из URL
    const error = useSelector<AppRootStateType, string>(state => state.cards.error)
    const {minGrade, maxGrade} = useSelector<AppRootStateType, GetSortedCardsType>(state => state.cards.sortParams)
    const dispatch = useDispatch()

    useEffect(() => {
        // if (isLoggedIn && packId) dispatch(getCardsTC(packId))   //запрашиваем карточки, если залогинен и есть packId
        if (!isLoggedIn) dispatch(getAuthUserDataTC())
    }, [])

    const onSortByGrade = useCallback((sortDirection: SortDirections) => {
        // dispatch(getCardsTC({sortDirection, propToSortBy: "grade"}))
    }, [dispatch])

    const onGradeRangeChange = useCallback(([minValue, maxValue]: Array<string | undefined>) => {
        // dispatch(getCardsTC({minGrade: minValue, maxGrade: maxValue}))
    }, [dispatch])

    const onSearchByQuestion = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {

        }
    }
    const onSearchByAnswer = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {

        }
    }

    if (!isLoggedIn) return <Redirect to={'/login'}/>

    return (
        <div className={style.cards}>
            <h2>Cards</h2>
            <div className={style.filter}>
                {/*фильтр карточек по вопросу*/}
                <label>Search cards by question: <input placeholder={'Press Enter to search'}
                                                        onKeyPress={onSearchByQuestion}/></label>
                {/*фильтр карточек по ответу*/}
                <label>Search cards by answer: <input placeholder={'Press Enter to search'}
                                                      onKeyPress={onSearchByAnswer}/></label>
                {/*двойной range для сортировки по оценкам (grade)*/}
                Search cards by grade:
                <DoubleRange minValue={minGrade} maxValue={maxGrade} onValuesChange={onGradeRangeChange}
                             maxRangeLimit={'5'}/>
            </div>
            {error && <div style={{color: 'red', margin: '0 auto'}}>{error}</div>}
            <table width="100%" cellPadding="4" className={style.table}>
                <tr style={{outline: 'medium solid'}}>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>
                        <div className={style.cellWithButtons}>Grade<SortButtons onClick={onSortByGrade}/></div>
                    </th>
                    <th>Last Updated</th>
                    <th>URL</th>
                    <th>
                        <button>Add</button>
                    </th>
                </tr>
                {/*мапим карточки, чтобы они появились в таблице*/}
                {/*{cards.map(c => <tr key={c._id}>*/}
                {/*    <td>{c.question}</td>*/}
                {/*    <td>{c.answer}</td>*/}
                {/*    <td>{c.grade}</td>*/}
                {/*    <td>{c.updated}</td>*/}
                {/*    <td>string</td>*/}
                {/*    <td>*/}
                {/*        <button>Delete</button>*/}
                {/*        <button>Update</button>*/}
                {/*    </td>*/}
                {/*</tr>)}*/}

            </table>
            {/*Pagination*/}
            <div className={style.pagination}>
                Pagination
                {/*номер текущей страницы (сначала вводим, а затем сетаем значение с сервера),*/}
                <input type="number"/>
                {/*отмапленные кнопки для перехода на другие страницы и*/}
                <button>кнопки для перехода на другие страницы</button>
                {/*общее количество страниц*/}
                <span>общее кол-во страниц</span>
            </div>
        </div>
    );
}