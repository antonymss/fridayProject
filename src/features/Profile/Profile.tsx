import React, {useState} from "react";
import style from "./Profile.module.css";
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {InitialAuthStateType, logoutTC, updateUserDataTC} from "../Login/auth-reducer";
import {Avatar, Popover} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import { Typography } from 'antd';
import {PATH} from "../../app/App";

export const Profile = () => {
    const {
        email,
        name,
        error,
        avatar,
        isLoggedIn,
        requestStatus
    } = useSelector<AppRootStateType, InitialAuthStateType>(state => state.auth)
    const dispatch = useDispatch()
    const { Paragraph } = Typography;
    const [newAvatarUrl, setNewAvatarUrl] = useState('')

    const onLogoutClick = () => {
        dispatch(logoutTC())
    }
    const onChangeAvatarClick = () => {
        dispatch(updateUserDataTC({avatar: newAvatarUrl}))
    }
    const onNewNameSubmit = (newName: string) => {
        dispatch(updateUserDataTC({name: newName}))
    }

    const setAvatarTools = (
        <span>
            <label>Enter avatar URL or Base64:
                <input onChange={e => setNewAvatarUrl(e.currentTarget.value)}
                       value={newAvatarUrl}/>
            </label>
            <button onClick={onChangeAvatarClick}>Set Avatar</button>
        </span>
    )

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>

    return (
        <div className={style.profile}>
            Welcome!
            {requestStatus === 'loading' && <div style={{color: 'green'}}>loading...</div>}
            {error && <div style={{color: 'red'}}>{error}</div>}
            {avatar
                ? <Popover content={setAvatarTools} title="Change avatar" trigger="hover">
                    <Avatar src={avatar} size={64}/>
                </Popover>
                : <Popover content={setAvatarTools} title="Add avatar" trigger="hover">
                    <Avatar size={64}
                            icon={<UserOutlined/>}/>
                </Popover>}
            <Paragraph editable={{ onChange: onNewNameSubmit }}>{name}</Paragraph>
            <div>{email}</div>
            <button onClick={onLogoutClick} disabled={requestStatus === 'loading'}>Log out</button>
        </div>
    );
}