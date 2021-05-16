import {Dispatch} from "redux";
import {RequestStatusType} from "../Login/auth-reducer";
import {GetSortedCardsType, SortDirections} from "../../api/api";

const initialState = {
    requestStatus: 'idle' as RequestStatusType, //изначально статус запроса - "неактивный"
    error: '',
    sortParams: {
        question: '',
        answer: '',
        sortDirection: SortDirections.Down,
        propToSortBy: undefined,
        minGrade: '0',
        maxGrade: '5',
        page: 1,
        pageCount: 10
    } as GetSortedCardsType
}

export const cardsReducer = (state = initialState, action: ActionsType): CardsStateType => {
    switch (action.type) {
        case 'CARDS/SET-REQUEST-STATUS': {
            return {
                ...state,
                requestStatus: action.requestStatus,
                error: action.requestStatus === 'success'
                    ? ''
                    : state.error
            }
        }
        case 'CARDS/SET-ERROR': {
            return {
                ...state,
                error: action.error
            }
        }
        case 'CARDS/SET-SORT-PARAMS': {
            return {
                ...state,
                sortParams: {...state.sortParams, ...action.sortParams}
            }
        }
        default:
            return state
    }
} // (при создании кейсов заменить "action: any" на общий тип actionов (ниже) "action: ActionsType")

//action creators
const setRequestStatusAC = (requestStatus: RequestStatusType) => ({
    type: 'CARDS/SET-REQUEST-STATUS',
    requestStatus
} as const)
const setErrorAC = (error: string) => ({type: 'CARDS/SET-ERROR', error} as const)
const setSortParamsAC = (sortParams: GetSortedCardsType) => ({type: 'CARDS/SET-SORT-PARAMS', sortParams} as const)

//thunk
// export const resetPasswordTC = (password: string, resetPasswordToken: string | undefined) => (dispatch: ThunkDispatch) => {
//     dispatch(setRequestStatusAC('loading'))
//     authAPI.resetPassword({password, resetPasswordToken})
//         .then(res => {
//             dispatch(setInfoAC(res.data.info))
//             dispatch(setRequestStatusAC('success'))
//         })
//         .catch(e => {
//             const error = e.response
//                 ? e.response.data.error
//                 : (e.message + ', more details in the console')
//             dispatch(setErrorAC(error))
//             dispatch(setRequestStatusAC('failed'))
//         })
// }

//types
export type CardsStateType = typeof initialState
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>
    | ReturnType<typeof setSortParamsAC>

// тип диспатча:
type ThunkDispatch = Dispatch<ActionsType>