import {authAPI, RegDataType} from "../../api/api";
import {Dispatch} from "redux";


const initialState = {
    responseText: '',
    isRegistration: false
}

export const registerReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        //cases
        case "REGISTER/SUCCESS_REGISTER": {
            return {...state, responseText: action.text}
        }
        case "REGISTER/SET-REGISTRATION": {
            return {...state, isRegistration: action.isRegistration}
        }
        default:
            return state
    }
} // (при создании кейсов заменить "action: any" на общий тип actionов (ниже) "action: ActionsType")

//action creators
// export const setSomethingAC = () => ({type: 'REGISTER/SET-SOMETHING'} as const)
const setResponseTextAC = (text: string) => ({type: 'REGISTER/SUCCESS_REGISTER', text} as const)
const setRegistrationAC = (isRegistration: boolean) => ({type: 'REGISTER/SET-REGISTRATION', isRegistration} as const)
//thunk
// export const doSomethingTC = () => (dispatch: ThunkDispatch) => {
//
// }
export const requestRegister = (regData: RegDataType) => (dispatch: ThunkCustomDispatch) => {
    authAPI.register(regData)
        .then((res) => {
            dispatch(setResponseTextAC('success'))

            setTimeout(() => {
                dispatch(setRegistrationAC(true))
                dispatch(setResponseTextAC(''))
                dispatch(setRegistrationAC(false))
            }, 1000)

        })
        .catch((err) => {

            dispatch(setResponseTextAC(err.response.data.error))
            setTimeout(() => {
                dispatch(setResponseTextAC(''))
            }, 3000)
        })
}
//types
export type InitialStateType = typeof initialState
//объединение типов actionов:
// export type ActionsType = ReturnType<typeof setSomethingAC>
type ActionsType = ReturnType<typeof setResponseTextAC> | ReturnType<typeof setRegistrationAC>
// тип диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>