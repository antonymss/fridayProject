import React, {useCallback, useEffect, useState} from "react";
import style from "./Profile.module.css";
import {Redirect, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {InitialAuthStateType, updateUserDataTC} from "../Login/auth-reducer";
import {Avatar, Button, Typography} from 'antd';
import {DeleteTwoTone, EditTwoTone, PlusSquareTwoTone, UserOutlined} from '@ant-design/icons';
import {PATH} from "../../app/App";
import commonStyle from "../../common/styles/error.module.css";
import {FileUploader, UploadedFileDataType} from "../../common/FileUploader/FileUploader";
import {DeleteItemModal} from "../Modals/DeleteItemModal/DeleteItemModal";
import {getUserByIdTC} from "../Users/users-reducer";
import {getPacksTC, PacksStateType, setPacksAC} from "../Packs/packs-reducer";
import {PacksTable} from "../Packs/PacksTable";
import {Paginator} from "../Paginator/Paginator";

export const Profile = () => {
    const {_id, email, name, error, avatar, isLoggedIn, requestStatus} = useSelector<AppRootStateType,
        InitialAuthStateType>(state => state.auth)
    const {
        cardPacksTotalCount,
        page,
        pageCount,
        cardPacks,
        requestStatus: packsLoadingStatus
    } = useSelector<AppRootStateType, PacksStateType>(state => state.packs)
    const dispatch = useDispatch()
    const currentUserData = useSelector<AppRootStateType, {
        _id: string, email: string, name: string, avatar: string
    }>(state => state.users.currentUserData)
    const {Paragraph} = Typography;
    const {userId} = useParams<{ userId?: string }>()
    const [showDeleteItemModal, setShowDeleteItemModal] = useState<boolean>(false)

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(setPacksAC([], 0, 1, 10))
            if (userId && userId !== _id) { // если выбран юзер со страницы Users и его id есть в url
                dispatch(getUserByIdTC(userId))
                dispatch(getPacksTC({userId, page: 1, pageCount: 5}))
            } else {
                dispatch(getPacksTC({userId: _id, page: 1, pageCount: 5}))
            }
        }
    }, [userId])

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
    const onPaginatorChange = useCallback((page: number, pageCount: number | undefined) => {
        dispatch(getPacksTC({page, pageCount}))
    }, [dispatch])

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>

    return (
        <div className={style.profile}>
            {requestStatus === 'loading' && <div className={style.loading}>loading...</div>}
            <div className={error && commonStyle.error}>{error}</div>
            <div className={style.avatarContainer}>
                {userId && currentUserData._id !== _id
                    ? <Avatar src={currentUserData.avatar || ''} size={64}
                              icon={!currentUserData.avatar && <UserOutlined/>}/>
                    : avatar && avatar !== "0" ? <>
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
            {userId && currentUserData._id !== _id
                ? <>
                    <div>{currentUserData.name}</div>
                    <div>{currentUserData.email}</div>
                    {/*колоды карточек текущего открытого юзера*/}
                    <div><PacksTable authUserId={_id} cardPacks={cardPacks} viewOnly
                                     requestStatus={packsLoadingStatus}/></div>
                </>
                : <>
                    <Paragraph editable={{onChange: onNewNameSubmit}}>{name}</Paragraph>
                    <div>{email}</div>
                    {/*колоды карточек текущего залогиненного юзера*/}
                    <div>
                        <PacksTable authUserId={_id} cardPacks={cardPacks} requestStatus={packsLoadingStatus}/>
                    </div>
                </>}
            {/*Pagination*/}
            <div className={style.pagination}>
                <Paginator current={page}
                           pageCount={pageCount}
                           total={cardPacksTotalCount}
                           onChange={onPaginatorChange}
                           requestStatus={packsLoadingStatus}/>
            </div>

            {/*появляющаяся модалка для удаления аватара*/}
            {showDeleteItemModal &&
            <DeleteItemModal itemToDelete={'image'} onDeleteBtnClick={onDeleteAvatarClick}
                             setShow={setShowDeleteItemModal}
                             show={showDeleteItemModal}/>}
        </div>
    );
}