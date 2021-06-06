import React from "react";
import style from './Header.module.css';
import {NavLink} from "react-router-dom";
import {PATH} from "../../app/App";
import {
    CloudServerOutlined,
    BlockOutlined,
    HomeOutlined,
} from '@ant-design/icons';

export const Header = () => {
    return (
        <div className={style.header}>
            <div className={style.linksContainer}>
                <NavLink to={PATH.PROFILE} activeClassName={style.active}><HomeOutlined
                    style={{fontSize: '25px'}}/></NavLink>
                <NavLink to={PATH.PACKS} activeClassName={style.active}>
                    <BlockOutlined style={{fontSize: '25px'}}/>
                    Card Packs to Learn</NavLink>
                <NavLink to={PATH.FILES} activeClassName={style.active}>
                    <CloudServerOutlined style={{fontSize: '25px'}}/>
                    Files</NavLink>
            </div>
        </div>
    );
}