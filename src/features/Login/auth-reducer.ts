import {Dispatch} from "redux";
import {authAPI, LoginDataType} from "../../api/api";
import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../../app/store";

const initialState = {
    _id: "",
    email: "",
    name: "",
    avatar: "" as string | undefined,
    error: "",
    isLoggedIn: false,
    requestStatus: 'idle' as RequestStatusType //изначально статус запроса - "неактивный"
}

export const authReducer = (state: InitialAuthStateType = initialState, action: ActionsType): InitialAuthStateType => {
    switch (action.type) {
        case 'AUTH/SET-AUTH-USER-DATA': {
            return {
                ...state,
                ...action.payload
            }
        }
        case 'AUTH/SET-REQUEST-STATUS': {
            return {
                ...state,
                requestStatus: action.requestStatus,
                error: action.requestStatus === 'success'
                    ? ''
                    : state.error
            }
        }
        case 'AUTH/SET-ERROR': {
            return {
                ...state,
                error: action.error
            }
        }
        default:
            return state
    }
} // (при создании кейсов заменить "action: any" на общий тип actionов (ниже) "action: ActionsType")

//action creators
export const setAuthUserDataAC = (_id: string, email: string, name: string, avatar: string | undefined, isLoggedIn: boolean) => ({
    type: 'AUTH/SET-AUTH-USER-DATA',
    payload: {_id, email, name, avatar, isLoggedIn}
} as const)
const setRequestStatusAC = (requestStatus: RequestStatusType) => ({
    type: 'AUTH/SET-REQUEST-STATUS',
    requestStatus
} as const)

const setErrorAC = (error: string) => ({type: 'AUTH/SET-ERROR', error} as const)


//thunks
export const loginTC = (loginData: LoginDataType) => (dispatch: ThunkCustomDispatch) => {
    dispatch(setRequestStatusAC('loading'))
    authAPI.login(loginData)
        .then((res) => {
            dispatch(setAuthUserDataAC(res.data._id, res.data.email, res.data.name, res.data.avatar, true))
            dispatch(setRequestStatusAC('success'))
        })
        .catch(e => {
            const error = e.response
                ? e.response.data.error
                : (e.message + ', more details in the console')
            dispatch(setErrorAC(error))
            dispatch(setRequestStatusAC('failed'))
            setTimeout(() => {
                dispatch(setErrorAC(''))
            }, 3000)
        })
}

export const logoutTC = () => (dispatch: ThunkCustomDispatch) => {
    dispatch(setRequestStatusAC('loading'))
    authAPI.logout()
        .then(() => {
            dispatch(setAuthUserDataAC("", "", "", "", false))
            dispatch(setRequestStatusAC('success'))
        })
        .catch(e => {
            const error = e.response
                ? e.response.data.error
                : (e.message + ', more details in the console')
            dispatch(setErrorAC(error))
            dispatch(setRequestStatusAC('failed'))
            setTimeout(() => {
                dispatch(setErrorAC(''))
            }, 3000)
        })
}

export const updateUserDataTC = (newData: { name?: string, avatar?: string }) => (dispatch: ThunkDispatch<AppRootStateType, void, ActionsType>,
                                                                                  getState: () => AppRootStateType) => {
    dispatch(setRequestStatusAC('loading'))
    authAPI.updateUserData({
        name: newData.name || getState().auth.name,
        avatar: newData.avatar || getState().auth.avatar
    })
        .then(res => {
            dispatch(setAuthUserDataAC(res.data.updatedUser._id, res.data.updatedUser.email,
                res.data.updatedUser.name, res.data.updatedUser.avatar, getState().auth.isLoggedIn))
            dispatch(setRequestStatusAC('success'))
        })
        .catch(e => {
            const error = e.response
                ? e.response.data.error
                : (e.message + ', more details in the console')
            dispatch(setErrorAC(error))
            dispatch(setRequestStatusAC('failed'))
            setTimeout(() => {
                dispatch(setErrorAC(''))
            }, 3000)
        })
}

//types
export type InitialAuthStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setAuthUserDataAC>
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>

// тип диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>