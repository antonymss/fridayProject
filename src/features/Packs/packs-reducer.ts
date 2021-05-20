import {GetSortedPacksType, PackDataType, packsAPI, SortDirections} from "../../api/api";
import {Dispatch} from "redux";
import {RequestStatusType} from "../Login/auth-reducer";
import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../../app/store";


const initialState = {
    cardPacks: [] as Array<PackDataType>,
    requestStatus: 'idle' as RequestStatusType,
    error: "",
    cardPacksTotalCount: 0,
    page: 1,
    sortParams: {
        nameToSearch: '',
        minCardsCount: 0,
        maxCardsCount: 100,
        sortDirection: SortDirections.Down,
        propToSortBy: undefined,
        page: 1,
        pageCount: 10,
        userId: ''
    } as GetSortedPacksType
}

export const packsReducer = (state = initialState, action: ActionsType): PacksStateType => {
    switch (action.type) {
        case 'PACKS/SET-PACKS': {
            return {
                ...state,
                cardPacks: action.cardPacks,
                cardPacksTotalCount: action.cardPacksTotalCount,
                page: action.page

            }
        }
        case 'PACKS/SET-REQUEST-STATUS': {
            return {
                ...state,
                requestStatus: action.requestStatus,
                error: action.requestStatus === 'success'
                    ? ''
                    : state.error
            }
        }
        case 'PACKS/SET-ERROR': {
            return {
                ...state,
                error: action.error
            }
        }
        case 'PACKS/SET-SORT-PARAMS': {
            return {
                ...state,
                sortParams: {...state.sortParams, ...action.sortParams}
            }
        }
            ;

        default:
            return state
    }
} // (при создании кейсов заменить "action: any" на общий тип actionов (ниже) "action: ActionsType")

//action creators
const setPacksAC = (cardPacks: Array<PackDataType>, cardPacksTotalCount: number, page: number) => ({
    type: 'PACKS/SET-PACKS',
    cardPacks, cardPacksTotalCount,
    page
} as const)
const setRequestStatusAC = (requestStatus: RequestStatusType) => ({
    type: 'PACKS/SET-REQUEST-STATUS',
    requestStatus
} as const)

const setErrorAC = (error: string) => ({type: 'PACKS/SET-ERROR', error} as const)
const setSortParamsAC = (sortParams: GetSortedPacksType) => ({type: 'PACKS/SET-SORT-PARAMS', sortParams} as const)


//thunk
export const getPacksTC = (params: GetSortedPacksType = {}) => (dispatch: ThunkCustomDispatch, getState: () => AppRootStateType) => {
    if (params) dispatch(setSortParamsAC(params))
    const sortParams = getState().packs.sortParams
    dispatch(setRequestStatusAC('loading'))
    packsAPI.getPacks(sortParams)
        .then(res => {
            dispatch(setPacksAC(res.data.cardPacks, res.data.cardPacksTotalCount, res.data.page))
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

export const addPackTC = (name?: string, isPrivate?: boolean, deckCover?: string) => (dispatch: ThunkDispatch<AppRootStateType, void, ActionsType>) => {
    dispatch(setRequestStatusAC('loading'))
    packsAPI.addPack(name, isPrivate, deckCover)
        .then(() => {
            dispatch(getPacksTC())
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

export const deletePackTC = (packId: string) => (dispatch: ThunkDispatch<AppRootStateType, void, ActionsType>) => {
    dispatch(setRequestStatusAC('loading'))
    packsAPI.deletePack(packId)
        .then(() => {
            dispatch(getPacksTC())
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

export const updatePackTC = (packId: string, name?: string) => (dispatch: ThunkDispatch<AppRootStateType, void, ActionsType>) => {
    dispatch(setRequestStatusAC('loading'))
    packsAPI.updatePack(packId, name)
        .then(() => {
            dispatch(getPacksTC())
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
export type PacksStateType = typeof initialState
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setPacksAC>
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>
    | ReturnType<typeof setSortParamsAC>


// тип диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>