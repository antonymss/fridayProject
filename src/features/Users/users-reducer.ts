import {Dispatch} from "redux";
import {RequestStatusType} from "../Login/auth-reducer";
import {AppRootStateType} from "../../app/store";
import {GetUsersResponseType, usersAPI, UsersSortParamsType, UserType} from "../../api/social-api";


const initialState = {
    users: [] as Array<UserType>,
    minPublicCardPacksCount: 0,
    maxPublicCardPacksCount: 100,
    page: 1,
    pageCount: 10,
    usersTotalCount: 0,
    requestStatus: 'idle' as RequestStatusType,
    error: "",
    sortParams: {
        userName: '',
        minPublicCardPacksCount: 0,
        maxPublicCardPacksCount: 100,
        sortDirection: undefined,
        propToSortBy: '',
        page: undefined,
        pageCount: undefined
    } as UsersSortParamsType,
    currentUserData: {
        _id: "",
        email: "",
        name: "",
        avatar: ""
    }
}

export const usersReducer = (state = initialState, action: ActionsType): UsersStateType => {
    switch (action.type) {
        case 'USERS/SET-USERS': {
            return {
                ...state,
                ...action.payload
            }
        }
        case 'USERS/SET-REQUEST-STATUS': {
            return {
                ...state,
                requestStatus: action.requestStatus,
                error: action.requestStatus === 'success'
                    ? ''
                    : state.error
            }
        }
        case 'USERS/SET-ERROR': {
            return {
                ...state,
                error: action.error
            }
        }
        case 'USERS/SET-SORT-PARAMS': {
            return {
                ...state,
                sortParams: {...state.sortParams, ...action.sortParams}
            }
        }
        case 'USERS/SET-CURRENT-USER-DATA': {
            return {
                ...state,
                currentUserData: {...action.payload}
            }
        }
        default:
            return state
    }
}

//action creators
export const setUsersAC = (payload: GetUsersResponseType) => ({type: 'USERS/SET-USERS', payload} as const)
const setRequestStatusAC = (requestStatus: RequestStatusType) => ({
    type: 'USERS/SET-REQUEST-STATUS',
    requestStatus
} as const)

const setErrorAC = (error: string) => ({type: 'USERS/SET-ERROR', error} as const)
const setSortParamsAC = (sortParams: UsersSortParamsType) => ({type: 'USERS/SET-SORT-PARAMS', sortParams} as const)
export const setCurrentUserDataAC = (_id: string, email: string, name: string, avatar: string) => ({
    type: 'USERS/SET-CURRENT-USER-DATA',
    payload: {_id, email, name, avatar}
} as const)

//thunk
export const getUsersTC = (params: UsersSortParamsType = {}) => (dispatch: ThunkCustomDispatch, getState: () => AppRootStateType) => {
    if (params) dispatch(setSortParamsAC(params))
    const sortParams = getState().users.sortParams
    dispatch(setRequestStatusAC('loading'))
    usersAPI.getUsers(sortParams)
        .then(res => {
            let payload = {
                users: res.data.users,
                maxPublicCardPacksCount: res.data.maxPublicCardPacksCount,
                minPublicCardPacksCount: res.data.minPublicCardPacksCount,
                page: res.data.page,
                pageCount: res.data.pageCount,
                usersTotalCount: res.data.usersTotalCount,
            }
            dispatch(setUsersAC(payload))
            dispatch(setRequestStatusAC('success'))

        })
        .catch(e => {
            const error = e.response
                ? e.response.data.error
                : (e.message + ', more details in the console')
            dispatch(setErrorAC(error))
            dispatch(setRequestStatusAC('failed'))
        })
}

export const getUserByIdTC = (userId: string) => (dispatch: ThunkCustomDispatch) => {
    dispatch(setRequestStatusAC('loading'))
    usersAPI.getUserByID(userId)
        .then((res) => {
            dispatch(setCurrentUserDataAC(res.data.user._id, res.data.user.email, res.data.user.name, res.data.user.avatar))
            dispatch(setRequestStatusAC('success'))
        })
        .catch(e => {
            const error = e.response
                ? e.response.data.error
                : (e.message + ', more details in the console')
            dispatch(setErrorAC(error))
            dispatch(setRequestStatusAC('failed'))
        })
}

//types
export type UsersStateType = typeof initialState
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setUsersAC>
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>
    | ReturnType<typeof setSortParamsAC>
    | ReturnType<typeof setCurrentUserDataAC>


// тип диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>