import {Dispatch} from "redux";
import {RequestStatusType} from "../Login/auth-reducer";
import {CardDataType, cardsAPI, GetSortedCardsType, NewCardDataType, SortDirections} from "../../api/api";
import {AppRootStateType} from "../../app/store";
import {ThunkDispatch} from "redux-thunk";

const initialState = {
    requestStatus: 'idle' as RequestStatusType, //изначально статус запроса - "неактивный"
    error: '',
    cards: [] as Array<CardDataType>,
    packUserId: "",
    cardsTotalCount: 0,
    page: 0,
    sortParams: {
        question: '',
        answer: '',
        sortDirection: SortDirections.Down,
        propToSortBy: undefined,
        minGrade: 0,
        maxGrade: 5,
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
        case 'CARDS/SET-CARDS': {
            return {
                ...state,
                cards: action.cards,
                packUserId: action.packUserId,
                page: action.page,
                cardsTotalCount: action.cardsTotalCount
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
const setCardsAC = (cards: Array<CardDataType>, packUserId: string, page: number, cardsTotalCount: number) =>
    ({type: 'CARDS/SET-CARDS', cards, packUserId, page, cardsTotalCount} as const)

//thunk
export const getCardsTC = (packId: string, params: GetSortedCardsType = {}) => (dispatch: ThunkCustommDispatch, getState: () => AppRootStateType) => {
    if (params) dispatch(setSortParamsAC(params))
    const sortParams = getState().cards.sortParams
    dispatch(setRequestStatusAC('loading'))
    cardsAPI.getCards(packId, sortParams)
        .then(res => {
            dispatch(setCardsAC(res.data.cards, res.data.packUserId, res.data.page, res.data.cardsTotalCount))
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

export const addCardTC = (packId: string, params?: GetSortedCardsType) => (dispatch: ThunkDispatch<AppRootStateType, void, ActionsType>) => {
    dispatch(setRequestStatusAC('loading'))
    cardsAPI.addCard(packId, params)
        .then(() => {
            dispatch(getCardsTC(packId, params))
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

export const deleteCardTC = (packId: string, cardId: string) => (dispatch: ThunkDispatch<AppRootStateType, void, ActionsType>) => {
    dispatch(setRequestStatusAC('loading'))
    cardsAPI.deleteCard(cardId)
        .then(() => {
            dispatch(getCardsTC(packId))
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

export const updateCardTC = (packId: string, cardId: string, params: NewCardDataType = {}, comments?: string) => (dispatch: ThunkDispatch<AppRootStateType, void, ActionsType>) => {
    dispatch(setRequestStatusAC('loading'))
    cardsAPI.updateCard(cardId, params, comments)
        .then(() => {
            dispatch(getCardsTC(packId))
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
export type CardsStateType = typeof initialState
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>
    | ReturnType<typeof setSortParamsAC>
    | ReturnType<typeof setCardsAC>

// тип диспатча:
type ThunkCustommDispatch = Dispatch<ActionsType>