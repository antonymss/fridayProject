import React, {ChangeEvent, KeyboardEvent, useCallback, useEffect, useState} from "react";
import style from "./Packs.module.css";
import {SortButtons} from "../../common/SortButtons/SortButtons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {Redirect} from "react-router-dom";
import {addPackTC, getPacksTC, PacksStateType} from "./packs-reducer";
import {GetSortedPacksType, SortDirections} from "../../api/api";
import {DoubleRange} from "../../common/DoubleRange/DoubleRange";
import {Pack} from "./Pack/Pack";
import {Paginator} from "../Paginator/Paginator";
import {PATH} from "../../app/App";

export const Packs = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const authUserId = useSelector<AppRootStateType, string>(state => state.auth._id)
    const error = useSelector<AppRootStateType, string>(state => state.packs.error)
    const {cardPacksTotalCount, page, cardPacks} = useSelector<AppRootStateType, PacksStateType>(state => state.packs)

    const {
        minCardsCount,
        maxCardsCount,
        userId
    } = useSelector<AppRootStateType, GetSortedPacksType>(state => state.packs.sortParams)
    const dispatch = useDispatch()

    const [searchByName, setSearchByName] = useState('')

    useEffect(() => {
        if (isLoggedIn) dispatch(getPacksTC())
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
            dispatch(getPacksTC({nameToSearch: searchByName}))
        }
    }
    const onCardsCountChange = useCallback(([minValue, maxValue]: Array<number | undefined>) => {
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

    const paginatorPage = useCallback((page: number, pageCount: number | undefined) => {
        dispatch(getPacksTC({page, pageCount}))
    }, [dispatch])

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>

    return (
        <div className={style.packs}>
            <h2>Packs</h2>
            <div className={style.filter}>
                {/*поиск приватных колод*/}
                <label><input type="checkbox" checked={!!userId} onChange={onPrivatePacksSearch}/>
                    show my private packs</label>
                {/*фильтр по названию колоды*/}
                <label>Search packs by name: <input placeholder={'Press Enter to search'}
                                                    onKeyPress={onSearchByName}
                                                    value={searchByName}
                                                    onChange={e => setSearchByName(e.currentTarget.value)}
                /></label>

                {/*двойной range для сортировки по кол-ву карточек в колоде*/}
                <div style={{display: "flex"}}>Search packs by cards count:
                    <DoubleRange minValue={minCardsCount} maxValue={maxCardsCount} onValuesChange={onCardsCountChange}
                                 maxRangeLimit={200}/></div>
            </div>
            {error && <div style={{color: 'red', margin: '0 auto'}}>{error}</div>}
            <table width="100%" cellPadding="4" className={style.table}>
                <thead style={{outline: 'medium solid'}}>
                <tr>
                    <th>
                        <div className={style.cellWithButtons}>Name<SortButtons onClick={onSortByName}/></div>
                    </th>
                    <th>
                        <div className={style.cellWithButtons}>Cards Count<SortButtons onClick={onSortByCardsCount}/>
                        </div>
                    </th>
                    <th>Last Update</th>
                    <th>Created by</th>
                    <th>
                        <button onClick={onAddBtnClick}>Add</button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {/*мапим колоды, чтобы они появились в таблице*/}
                {cardPacks.map(p => <Pack key={p._id} pack={p} authUserId={authUserId}/>)}
                </tbody>
            </table>
            {/*Pagination*/}
            <div className={style.pagination}>
                <Paginator current={page}
                           total={cardPacksTotalCount}
                           onChange={paginatorPage}/>
            </div>
        </div>
    );
}