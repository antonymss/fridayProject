import React from "react";
import style from './Header.module.css';
import {NavLink} from "react-router-dom";
import {PATH} from "../../app/App";
import {
    BlockOutlined,
    CloudServerOutlined,
    HomeOutlined,
    LogoutOutlined,
    TeamOutlined,
    WechatOutlined,
    CompassOutlined
} from '@ant-design/icons';
import {Chat} from "../Chat/Chat";
import {Button, Popover} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {InitialAuthStateType, logoutTC} from "../Login/auth-reducer";

export const Header = () => {
    const {requestStatus, isLoggedIn} = useSelector<AppRootStateType, InitialAuthStateType>(state => state.auth)
    const dispatch = useDispatch()

    const chatContent = (<Chat/>)

    const onLogoutClick = () => {
        dispatch(logoutTC())
    }

    return (
        <div className={style.header}>
            <NavLink to={PATH.PROFILE} activeClassName={style.active}><HomeOutlined
                style={{fontSize: '25px'}}/></NavLink>
            <Popover content={chatContent} trigger="click" placement="bottom">
                <WechatOutlined style={{fontSize: '25px', color: '#1890ff'}}/>
            </Popover>
            <NavLink to={PATH.PACKS} activeClassName={style.active}>
                <BlockOutlined style={{fontSize: '25px'}}/>
                Card Packs to Learn</NavLink>
            <NavLink to={PATH.FILES} activeClassName={style.active}>
                <CloudServerOutlined style={{fontSize: '25px'}}/>
                Files</NavLink>
            <NavLink to={PATH.USERS} activeClassName={style.active}>
                <Popover content={<div>back-end for Users is not finished yet</div>} placement="bottom">
                    <TeamOutlined style={{fontSize: '25px'}}/>Users
                </Popover>
            </NavLink>
            <NavLink to={PATH.MAP} activeClassName={style.active}>
                <CompassOutlined style={{fontSize: '25px'}}/>
                Map</NavLink>
            {isLoggedIn && <Button onClick={onLogoutClick} icon={<LogoutOutlined style={{fontSize: '25px', color: '#1890ff'}}/>}
                    disabled={requestStatus === 'loading'} shape="circle" ghost/>}
        </div>
    )
}