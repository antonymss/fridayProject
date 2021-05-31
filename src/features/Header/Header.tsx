import React from "react";
import style from './Header.module.css';
import {NavLink} from "react-router-dom";
import {PATH} from "../../app/App";

export const Header = () => {
    return (
        <div className={style.header}>
            <NavLink to={PATH.PROFILE} activeClassName={style.active}>Profile</NavLink>
            <NavLink to={PATH.PACKS} activeClassName={style.active}>Packs</NavLink>
            <NavLink to={PATH.FILES} activeClassName={style.active}>Files</NavLink>
        </div>
    );
}