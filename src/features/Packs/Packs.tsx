import React, {ChangeEvent, KeyboardEvent, useCallback, useEffect, useState} from "react";
import style from "./Packs.module.css";
import commonStyle from "../../common/styles/error.module.css";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {Redirect} from "react-router-dom";
import {getPacksTC, PacksStateType} from "./packs-reducer";
import {GetSortedPacksType} from "../../api/api";
import {DoubleRange} from "../../common/DoubleRange/DoubleRange";
import {Paginator} from "../Paginator/Paginator";
import {PATH} from "../../app/App";
import {PacksTable} from "./PacksTable";

export const Packs = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const authUserId = useSelector<AppRootStateType, string>(state => state.auth._id)
    const error = useSelector<AppRootStateType, string>(state => state.packs.error)
    const {
        cardPacksTotalCount,
        page,
        cardPacks,
        pageCount,
        requestStatus
    } = useSelector<AppRootStateType, PacksStateType>(state => state.packs)

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
            dispatch(getPacksTC({userId: authUserId, page: 1, pageCount: 10}))
        } else {
            dispatch(getPacksTC({userId: '', page: 1, pageCount: 10}))
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
                    My packs</label>
                {/*фильтр по названию колоды*/}
                <label>Search packs by name: <input placeholder={'Press Enter to search'}
                                                    onKeyPress={onSearchByName}
                                                    value={searchByName}
                                                    onChange={e => setSearchByName(e.currentTarget.value)}
                /></label>

                {/*двойной range для сортировки по кол-ву карточек в колоде*/}
                <div className={style.rangeContainer}>
                    Search packs by cards count:
                    <DoubleRange minValue={minCardsCount} maxValue={maxCardsCount} onValuesChange={onCardsCountChange}
                                 maxRangeLimit={200}/>
                </div>
            </div>
            <div className={error && commonStyle.error}>{error}</div>
            {/*таблица с колодами*/}
            <PacksTable cardPacks={cardPacks} authUserId={authUserId} requestStatus={requestStatus}/>
            {/*Pagination*/}
            <div className={style.pagination}>
                <Paginator current={page}
                           pageCount={pageCount}
                           total={cardPacksTotalCount}
                           onChange={paginatorPage}
                           requestStatus={requestStatus}/>
            </div>
        </div>
    );
}

