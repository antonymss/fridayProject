import {authAPI, RegDataType} from "../../api/api";
import {Dispatch} from "redux";


const initialState = {
    responseText: '', //used for errors as well
    isRegistration: false
}

export const registerReducer = (state: RegisterStateType = initialState, action: ActionsType): RegisterStateType => {
    switch (action.type) {
        case "REGISTER/SET-RESPONSE-TEXT": {
            return {...state, responseText: action.text}
        }
        case "REGISTER/SET-REGISTRATION": {
            return {
                ...state, isRegistration: action.isRegistration,
                responseText: action.isRegistration ? '' : state.responseText
            }
        }
        default:
            return state
    }
}

//action creators
const setResponseTextAC = (text: string) => ({type: 'REGISTER/SET-RESPONSE-TEXT', text} as const)
const setRegistrationAC = (isRegistration: boolean) => ({type: 'REGISTER/SET-REGISTRATION', isRegistration} as const)

//thunks
export const requestRegister = (regData: RegDataType) => (dispatch: ThunkCustomDispatch) => {
    authAPI.register(regData)
        .then(() => {
            dispatch(setResponseTextAC('success'))

            setTimeout(() => {
                dispatch(setRegistrationAC(true))
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
export type RegisterStateType = typeof initialState
//объединение типов actionов:
type ActionsType = ReturnType<typeof setResponseTextAC> | ReturnType<typeof setRegistrationAC>
// тип кастомного диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>