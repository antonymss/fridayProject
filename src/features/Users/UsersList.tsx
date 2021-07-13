import React from "react";
import {RequestStatusType} from "../Login/auth-reducer";
import {UserType} from "../../api/social-api";
import style from "./Users.module.css";
import {List, Avatar, Spin} from 'antd';
import {PATH} from "../../app/App";
import {NavLink} from "react-router-dom";

type PacksTablePropsType = {
    users: Array<UserType>
    requestStatus: RequestStatusType
}

export const UsersList = React.memo(({users, requestStatus}: PacksTablePropsType) => {

    return <div className={style.usersListContainer}>

        <List
            dataSource={users}
            renderItem={user => (
                <List.Item key={user._id}>
                    <List.Item.Meta
                        avatar={<Avatar src={user.avatar}/>}
                        title={user.name}
                        description={<>Created {user.publicCardPacksCount} public card packs</>}
                    />
                    <div>
                        <NavLink to={`${PATH.PROFILE}/${user._id}`}>
                            View profile
                        </NavLink>
                    </div>
                </List.Item>
            )}
        >
            {requestStatus === 'loading' && (
                <Spin/>
            )}
        </List>

    </div>
})