import React, {useCallback, useState} from "react";
import style from "./Profile.module.css";
import {NavLink, Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {InitialAuthStateType, logoutTC, updateUserDataTC} from "../Login/auth-reducer";
import {Avatar, Button, Popover, Typography} from 'antd';
import {DeleteTwoTone, EditTwoTone, PlusSquareTwoTone, CloudServerOutlined, UserOutlined} from '@ant-design/icons';
import {PATH} from "../../app/App";
import commonStyle from "../../common/styles/error.module.css";
import {FileUploader, UploadedFileDataType} from "../../common/FileUploader/FileUploader";
import {DeleteItemModal} from "../Modals/DeleteItemModal/DeleteItemModal";

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
    const {Paragraph} = Typography;
    const [showDeleteItemModal, setShowDeleteItemModal] = useState<boolean>(false)

    const onImageEditorClick = useCallback((fileData: UploadedFileDataType) => {
        dispatch(updateUserDataTC({avatar: fileData.base64}))
    }, [dispatch])
    const onDeleteAvatarClick = useCallback((isToBeDeleted: boolean) => {
        if (isToBeDeleted) {
            dispatch(updateUserDataTC({avatar: "0"}))
            setShowDeleteItemModal(false)
        }
    }, [dispatch])
    const onNewNameSubmit = useCallback((newName: string) => {
        dispatch(updateUserDataTC({name: newName}))
    }, [dispatch])
    const onLogoutClick = () => {
        dispatch(logoutTC())
    }

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>

    return (
        <div className={style.profile}>
            Welcome!
            {requestStatus === 'loading' && <div className={style.loading}>loading...</div>}
            <div className={error && commonStyle.error}>{error}</div>
            <div className={style.avatarContainer}>
                {avatar && avatar !== "0" ? <>
                        <Avatar src={avatar} size={64}/>
                        <div className={style.avatarButtons}>
                            <FileUploader onClick={onImageEditorClick} expectedFileType={'image'}>
                                <EditTwoTone style={{fontSize: '16px'}}/>
                            </FileUploader>
                            <div>
                                <Button onClick={() => {
                                    setShowDeleteItemModal(true)
                                }} icon={<DeleteTwoTone style={{fontSize: '16px'}}/>} shape="circle" ghost/>
                            </div>
                        </div>
                    </>
                    : <>
                        <Avatar size={64} icon={<UserOutlined/>}/>
                        <FileUploader onClick={onImageEditorClick} expectedFileType={'image'}
                                      style={{position: "absolute", top: "30%", right: "0"}}>
                            <PlusSquareTwoTone style={{fontSize: '16px'}}/>
                        </FileUploader>
                    </>}
            </div>
            <Paragraph editable={{onChange: onNewNameSubmit}}>{name}</Paragraph>
            <div>{email}</div>
            <button onClick={onLogoutClick} disabled={requestStatus === 'loading'}>Log out</button>
            {/*картинка со ссылкой на Files*/}
            <NavLink to={PATH.FILES}>
                <Popover title="Go to Files 🙂" trigger="hover">
                    <CloudServerOutlined style={{position: "absolute", top: "30%", right: "30%", fontSize: '52px', color: 'orange'}}/>
                </Popover>
            </NavLink>
            {/*появляющаяся модалка для удаления аватара*/}
            {showDeleteItemModal &&
            <DeleteItemModal itemToDelete={'image'} onDeleteBtnClick={onDeleteAvatarClick}
                             setShow={setShowDeleteItemModal}
                             show={showDeleteItemModal}/>}
        </div>
    );
}