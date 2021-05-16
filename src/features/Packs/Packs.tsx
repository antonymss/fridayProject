import React, {ChangeEvent, KeyboardEvent, useCallback, useEffect} from "react";
import style from "./Packs.module.css";
import {SortButtons} from "../../common/SortButtons/SortButtons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {getAuthUserDataTC} from "../Login/auth-reducer";
import {Redirect} from "react-router-dom";
import {addPackTC, getPacksTC} from "./packs-reducer";
import {GetSortedPacksType, PackDataType, SortDirections} from "../../api/api";
import {DoubleRange} from "../../common/DoubleRange/DoubleRange";
import {Pack} from "./Pack/Pack";

export const Packs = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const authUserId = useSelector<AppRootStateType, string>(state => state.auth._id)
    const packs = useSelector<AppRootStateType, Array<PackDataType>>(state => state.packs.cardPacks)
    const error = useSelector<AppRootStateType, string>(state => state.packs.error)
    const {
        minCardsCount,
        maxCardsCount,
        userId
    } = useSelector<AppRootStateType, GetSortedPacksType>(state => state.packs.sortParams)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isLoggedIn) dispatch(getPacksTC())
        if (!isLoggedIn) dispatch(getAuthUserDataTC())
    }, [])

    const onPrivatePacksSearch = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.checked) {
            dispatch(getPacksTC({userId: authUserId}))
        } else {
            dispatch(getPacksTC({userId: ''}))
        }
    }

    const onSearchByName = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {

        }
    }
    const onCardsCountChange = useCallback(([minValue, maxValue]: Array<string | undefined>) => {
        dispatch(getPacksTC({minCardsCount: minValue, maxCardsCount: maxValue}))
    }, [dispatch])

    const onSortByName = useCallback((sortDirection: SortDirections) => {
        dispatch(getPacksTC({sortDirection, propToSortBy: "name"}))
    }, [dispatch])

    const onSortByCardsCount = useCallback((sortDirection: SortDirections) => {
        dispatch(getPacksTC({sortDirection, propToSortBy: "cardsCount"}))
    }, [dispatch])

    const onAddBtnClick = () => {
        dispatch(addPackTC())
    }

    if (!isLoggedIn) return <Redirect to={'/login'}/>

    return (
        <div className={style.packs}>
            <h2>Packs</h2>
            <div className={style.filter}>
                {/*поиск приватных колод*/}
                <label><input type="checkbox" checked={!!userId} onChange={onPrivatePacksSearch}/> including my private packs</label>
                {/*фильтр по названию колоды*/}
                <label>Search packs by name: <input placeholder={'Press Enter to search'}
                                                    onKeyPress={onSearchByName}/></label>

                {/*двойной range для сортировки по кол-ву карточек в колоде*/}
                Search packs by cards count:
                <DoubleRange minValue={minCardsCount} maxValue={maxCardsCount} onValuesChange={onCardsCountChange}
                             maxRangeLimit={'200'}/>
            </div>
            {error && <div style={{color: 'red', margin: '0 auto'}}>{error}</div>}
            <table width="100%" cellPadding="4" className={style.table}>
                <tr style={{outline: 'medium solid'}}>
                    <th>
                        <div className={style.cellWithButtons}>Name<SortButtons onClick={onSortByName}/></div>
                    </th>
                    <th>
                        <div className={style.cellWithButtons}>Cards Count<SortButtons onClick={onSortByCardsCount}/>
                        </div>
                    </th>
                    <th>Last Updated</th>
                    <th>URL</th>
                    <th>
                        <button onClick={onAddBtnClick}>Add</button>
                    </th>
                </tr>

                {/*мапим колоды, чтобы они появились в таблице*/}
                {packs.map(p => <Pack key={p._id} pack={p}/>)}
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

