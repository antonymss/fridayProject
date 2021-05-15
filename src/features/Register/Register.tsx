import React, {useState} from "react";
import style from "./Register.module.css";
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {requestRegister} from "./register-reducer";
import {AppRootStateType} from "../../app/store";

export const Register = () => {
    const text = useSelector<AppRootStateType, string>(state => state.register.responseText)
    const isRegistration = useSelector<AppRootStateType, boolean>(state => state.register.isRegistration)

    const dispatch = useDispatch()
    const [emailValue, setEmailValue] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const regData = {email: emailValue, password: password}
    const setRegister = () => {
        dispatch(requestRegister(regData))
    }

    const failedPassword = password !== confirmPassword ? true : false

    if (isRegistration) {
        return <Redirect to={'/login'}/>
    }

    return (
        <div className={style.register}>
            <h1>{text}</h1>
            Register
            <input type="email" placeholder={'email'} onChange={(e) => setEmailValue(e.currentTarget.value)}/>
            <input type="password" placeholder={'password'} onChange={(e) => setPassword(e.currentTarget.value)}/>
            <input type="password" placeholder={'confirm password'}
                   onChange={(e) => setConfirmPassword(e.currentTarget.value)}/>
            <button onClick={setRegister} disabled={failedPassword}>Register</button>
            <NavLink to="/login" activeClassName={style.active}>Log in</NavLink>
        </div>
    );
}