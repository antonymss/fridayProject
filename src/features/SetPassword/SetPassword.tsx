import React, {ChangeEvent, useState} from "react";
import style from "./SetPassword.module.css";
import {NavLink, Redirect, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {resetPasswordTC, SetPasswordStateType} from "./set-password-reducer";
import commonStyle from "../../common/styles/error.module.css";

export const SetPassword = () => {
    const {requestStatus, error, info} = useSelector<AppRootStateType, SetPasswordStateType>(state => state.setPassword)
    const dispatch = useDispatch()
    const {token} = useParams<{ token?: string }>()

    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [localError, setLocalError] = useState('')

    const onPassword1Input = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword1(e.currentTarget.value)
    }
    const onPassword2Input = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword2(e.currentTarget.value)
    }
    const onSubmit = () => {
        if (password1 === password2 && password1.length >= 8) {
            dispatch(resetPasswordTC(password1, token))
        } else if (password1 !== password2) {
            setLocalError("Passwords don't match.")
        } else if (password1.length < 8 || password2.length < 8) {
            setLocalError("Password must contain at least 8 characters.")
        }
    }
    if (requestStatus === 'success') return <Redirect to={'/login'}/>

    return (
        <div className={style.setPassword}>
            Please enter your new password in each field.
            {requestStatus === 'loading'
                ? <div className={style.loading}>loading...</div>
                : info && <i>{info}</i>}
            <div className={error && commonStyle.error}>{error}</div>
            {localError && !error && <div className={commonStyle.error}>{localError}</div>}
            <input type="password" value={password1} onChange={onPassword1Input}
                   onKeyPress={() => setLocalError("")}/>
            <input type="password" value={password2} onChange={onPassword2Input}
                   onKeyPress={() => setLocalError("")}/>
            <button onClick={onSubmit} disabled={requestStatus === 'loading'}>Submit</button>
            <NavLink to="/login" activeClassName={style.active}>Log in</NavLink>
        </div>
    );
}