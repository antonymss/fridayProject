import React, {KeyboardEvent, useCallback, useEffect, useState} from "react";
import style from "./Users.module.css";
import commonStyle from "../../common/styles/error.module.css";
import {DoubleRange} from "../../common/DoubleRange/DoubleRange";
import {Paginator} from "../Paginator/Paginator";
import {UsersList} from "./UsersList";
import {Redirect} from "react-router-dom";
import {PATH} from "../../app/App";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {getUsersTC, UsersStateType} from "./users-reducer";
import {UsersSortParamsType} from "../../api/social-api";

export const Users = () => {
    const {
        users,
        error,
        requestStatus,
        usersTotalCount,
        page,
        pageCount,
    } = useSelector<AppRootStateType, UsersStateType>(state => state.users)
    const {minPublicCardPacksCount,
        maxPublicCardPacksCount} = useSelector<AppRootStateType, UsersSortParamsType>(state => state.users.sortParams)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const [searchByName, setSearchByName] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        if (isLoggedIn) dispatch(getUsersTC())
    }, [])

    const onSearchByName = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            dispatch(getUsersTC({userName: searchByName}))
        }
    }
    const onPacksCountChange = useCallback(([minValue, maxValue]: Array<number | undefined>) => {
        dispatch(getUsersTC({minPublicCardPacksCount: minValue, maxPublicCardPacksCount: maxValue}))
    }, [dispatch])

    const onPaginatorChange = useCallback((page: number, pageCount: number | undefined) => {
        dispatch(getUsersTC({page, pageCount}))
    }, [dispatch])

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>

    return (
        <div className={style.users}>
            <h2>Users</h2>
            <div className={style.filter}>
                {/*фильтр по названию колоды*/}
                <label>Search users by name: <input placeholder={'Press Enter to search'}
                                                    onKeyPress={onSearchByName}
                                                    value={searchByName}
                                                    onChange={e => setSearchByName(e.currentTarget.value)}
                /></label>

                {/*двойной range для сортировки по кол-ву карточек в колоде*/}
                <div className={style.rangeContainer}>
                    Search users by the number of their card packs:
                    <DoubleRange minValue={minPublicCardPacksCount} maxValue={maxPublicCardPacksCount} onValuesChange={onPacksCountChange}
                                 maxRangeLimit={200}/>
                </div>
            </div>
            <div className={error && commonStyle.error}>{error}</div>
            {/*таблица с колодами*/}
            <UsersList users={users} requestStatus={requestStatus}/>
            {/*Pagination*/}
            <div className={style.pagination}>
                <Paginator current={page}
                           pageCount={pageCount}
                           total={usersTotalCount}
                           onChange={onPaginatorChange}
                           requestStatus={requestStatus}/>
            </div>
        </div>
    );
}

