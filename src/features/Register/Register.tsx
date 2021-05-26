import React, {useState} from "react";
import style from "./Register.module.css";
import {NavLink, Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {requestRegister} from "./register-reducer";
import {AppRootStateType} from "../../app/store";
import commonStyle from "../../common/styles/error.module.css";

export const Register = () => {
    const text = useSelector<AppRootStateType, string>(state => state.register.responseText)
    const isRegistration = useSelector<AppRootStateType, boolean>(state => state.register.isRegistration)

    const dispatch = useDispatch()
    const [emailValue, setEmailValue] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')

    const regData = {email: emailValue, password: password}
    const setRegister = () => {
        if (password === confirmPassword && password.length >= 8) {
            dispatch(requestRegister(regData))
        } else if (password !== confirmPassword) {
            setErrorPassword("Passwords don't match.")
        } else if (password.length < 8 || confirmPassword.length < 8) {
            setErrorPassword("Password must contain at least 8 characters.")
        }
    }
    const clearError = () => {
        setErrorPassword('')
    }


    if (isRegistration) {
        return <Redirect to={'/login'}/>
    }

    return (
        <div className={style.register}>
            <h3>{text}</h3>
            Register
            <input type="email" placeholder={'email'} onChange={(e) => setEmailValue(e.currentTarget.value)}
                   onKeyPress={clearError}/>
            <input type="password" placeholder={'password'} onChange={(e) => setPassword(e.currentTarget.value)}
                   onKeyPress={clearError}/>
            <input type="password" placeholder={'confirm password'} onKeyPress={clearError}
                   onChange={(e) => setConfirmPassword(e.currentTarget.value)}/>
            <div className={errorPassword && commonStyle.error}>{errorPassword}</div>
            <button onClick={setRegister}>Register</button>
            <NavLink to="/login" activeClassName={style.active}>Log in</NavLink>
        </div>
    );
}