import {instance, SortDirections} from "./api";

const socketIo = require('socket.io-client');

//websocket для чата
export const socket = socketIo("https://neko-back.herokuapp.com/")

export const usersAPI = {
    getUsers(sortParams: UsersSortParamsType = {}) { // получение userов
        const {userName, minPublicCardPacksCount, maxPublicCardPacksCount, sortDirection = '', propToSortBy = '',
            page, pageCount} = sortParams
        return instance.get<GetUsersResponseType>(`social/users`, {params: {userName, min: minPublicCardPacksCount,
                max: maxPublicCardPacksCount, sortUsers: sortDirection + propToSortBy, page, pageCount}})
    },
    getUserByID(userId: string) {  // получение userа по ID
        return instance.get<GetUserByIDResponseType>(`social/user?id=${userId}`)
    }
}

//types
export type GetUsersResponseType = {
    users: Array<UserType>
    maxPublicCardPacksCount: number
    minPublicCardPacksCount: number
    page: number
    pageCount: number
    usersTotalCount: number
}

export type UserType = {
    avatar: string
    created: string
    email: string
    isAdmin: boolean
    name: string
    publicCardPacksCount: number
    updated: string
    verified: boolean
    _id: string
}

export type UsersSortParamsType = {
    userName?: string
    minPublicCardPacksCount?: number
    maxPublicCardPacksCount?: number
    sortDirection?: SortDirections
    propToSortBy?: string
    page?: number
    pageCount?: number
}
type GetUserByIDResponseType = {
    user: UserType
}