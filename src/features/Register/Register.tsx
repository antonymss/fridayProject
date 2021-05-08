import React from "react";
import style from "./Register.module.css";
import {NavLink} from "react-router-dom";

export const Register = () => {
    return (
        <div className={style.register}>
            Register
            <input type="email"/>
            <input type="password"/>
            <input type="password"/>
            <button>Register</button>
            <NavLink to="/login" activeClassName={style.active}>Log in</NavLink>
        </div>
    );
}