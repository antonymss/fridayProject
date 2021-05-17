import {RequestStatusType} from "../Login/auth-reducer";
import {Dispatch} from "redux";
import {authAPI} from "../../api/api";

const initialState = {
    requestStatus: 'idle' as RequestStatusType, //изначально статус запроса - "неактивный"
    error: '',
    info: ''
}

export const forgotReducer = (state: InitialForgotStateType = initialState, action: ActionsType): InitialForgotStateType => {
    switch (action.type) {
        case 'FORGOT/SET-REQUEST-STATUS': {
            return {
                ...state,
                requestStatus: action.requestStatus,
                error: action.requestStatus === 'success'
                    ? ''
                    : state.error
            }
        }
        case 'FORGOT/SET-ERROR': {
            return {
                ...state,
                error: action.error,
                info: ''
            }
        }
        case 'FORGOT/SET-INFO': {
            return {
                ...state,
                info: action.info,
                error: ''
            }
        }
        default:
            return state
    }
} // (при создании кейсов заменить "action: any" на общий тип actionов (ниже) "action: ActionsType")

//action creators
const setRequestStatusAC = (requestStatus: RequestStatusType) => ({
    type: 'FORGOT/SET-REQUEST-STATUS',
    requestStatus
} as const)
const setErrorAC = (error: string) => ({type: 'FORGOT/SET-ERROR', error} as const)
const setInfoAC = (info: string) => ({type: 'FORGOT/SET-INFO', info} as const)

//thunk
export const sendEmailToResetPassTC = (email: string) => (dispatch: ThunkCustomDispatch) => {
    dispatch(setRequestStatusAC('loading'))
    authAPI.sendEmailToResetPass(email)
        .then(res => {
            dispatch(setInfoAC(res.data.info))
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
export type InitialForgotStateType = typeof initialState
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>
    | ReturnType<typeof setInfoAC>
// тип диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>