import {Dispatch} from "redux";
import {authAPI, LoginDataType} from "../../api/api";

const initialState = {
    _id: "",
    email: "",
    name: "",
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
const setAuthUserDataAC = (_id: string, email: string, name: string, isLoggedIn: boolean) => ({
    type: 'AUTH/SET-AUTH-USER-DATA',
    payload: {_id, email, name, isLoggedIn}
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
            dispatch(setAuthUserDataAC(res.data._id, res.data.email, res.data.name, true))
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

export const logoutTC = () => (dispatch: ThunkCustomDispatch) => {
    dispatch(setRequestStatusAC('loading'))
    authAPI.logout()
        .then(() => {
            dispatch(setAuthUserDataAC("", "", "", false))
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

export const getAuthUserDataTC = () => (dispatch: ThunkCustomDispatch) => {
    dispatch(setRequestStatusAC('loading'))
    authAPI.me()
        .then(res => {
            dispatch(setAuthUserDataAC(res.data._id, res.data.email, res.data.name, true))
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
export type InitialAuthStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'success' | 'failed'
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setAuthUserDataAC>
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>

// тип диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>