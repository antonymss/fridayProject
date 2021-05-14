import React from "react";
import style from './Header.module.css';
import {NavLink} from "react-router-dom";
import {PATH} from "../../app/App";

export const Header = () => {
    return (
        <div className={style.header}>
            <NavLink to={PATH.LOGIN} activeClassName={style.active}>Login</NavLink>
            <NavLink to={PATH.REGISTER} activeClassName={style.active}>Register</NavLink>
            <NavLink to={PATH.FORGOT} activeClassName={style.active}>Forgot</NavLink>
            <NavLink to={PATH.SET_PASSWORD} activeClassName={style.active}>Set New Password</NavLink>
            <NavLink to={PATH.PROFILE} activeClassName={style.active}>Profile</NavLink>
            <NavLink to={PATH.PACKS} activeClassName={style.active}>Packs</NavLink>
            <NavLink to={PATH.CARDS} activeClassName={style.active}>Cards</NavLink>
        </div>
    );
}