import {Dispatch} from "redux";
import {authAPI} from "../api/api";
import {RequestStatusType, setAuthUserDataAC} from "../features/Login/auth-reducer";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state: InitialAppStateType = initialState, action: AppActionsType): InitialAppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

//action creators
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setAppErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const
}
export const setIsInitializedAC = (isInitialized: boolean) => {
    return {type: 'APP/SET-INITIALIZED', isInitialized} as const
}

//thunk
export const initializeAppTC = () => (dispatch: ThunkCustomDispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then(res => {
            dispatch(setAuthUserDataAC(res.data._id, res.data.email, res.data.name, res.data.avatar, true))
            dispatch(setAppStatusAC('success'))
            dispatch(setIsInitializedAC(true))
        })
        .catch(e => {
            const error = e.response
                ? e.response.data.error
                : (e.message + ', more details in the console')
            dispatch(setAppErrorAC(error))
            dispatch(setAppStatusAC('failed'))
            setTimeout(() => {
                dispatch(setAppErrorAC(''))
            }, 3000)
            dispatch(setIsInitializedAC(true))
        })
}

//types
export type InitialAppStateType = typeof initialState

export type AppActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setIsInitializedAC>

type ThunkCustomDispatch = Dispatch<AppActionsType | ReturnType<typeof setAuthUserDataAC>>