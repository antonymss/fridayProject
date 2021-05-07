import React from "react";
import style from './Header.module.css';
import {NavLink} from "react-router-dom";

export const Header = () => {
    return (
        <div className={style.header}>
            <NavLink to="/login" activeClassName={style.active}>Login</NavLink>
            <NavLink to="/register" activeClassName={style.active}>Register</NavLink>
            <NavLink to="/forgot" activeClassName={style.active}>Forgot</NavLink>
            <NavLink to="/set-new-password" activeClassName={style.active}>Set New Password</NavLink>
            <NavLink to="/profile" activeClassName={style.active}>Profile</NavLink>
        </div>
    );
}