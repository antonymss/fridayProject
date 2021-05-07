import React, {useEffect} from "react";
import style from "./Profile.module.css";
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {getAuthUserDataTC, InitialAuthStateType, logoutTC} from "../Login/auth-reducer";

export const Profile = () => {
    const {
        email,
        name,
        error,
        isLoggedIn,
        requestStatus
    } = useSelector<AppRootStateType, InitialAuthStateType>(state => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isLoggedIn) return
        dispatch(getAuthUserDataTC())
    }, [])

    const onLogoutClick = () => {
        dispatch(logoutTC())
    }

    if (!isLoggedIn) return <Redirect to={'/login'}/>

    return (
        <div className={style.profile}>
            Welcome!
            {requestStatus === 'loading' && <div style={{color: 'green'}}>loading...</div>}
            {error && <div style={{color: 'red'}}>{error}</div>}
            <div>{name}</div>
            <div>{email}</div>
            <button onClick={onLogoutClick} disabled={requestStatus === 'loading'}>Log out</button>
        </div>
    );
}