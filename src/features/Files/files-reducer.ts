import {Dispatch} from "redux";
import {RequestStatusType} from "../Login/auth-reducer";
import {filesAPI} from "../../api/files-api";


const initialState = {
    requestStatus: 'idle' as RequestStatusType,
    error: "",
}

export const filesReducer = (state = initialState, action: ActionsType): FilesStateType => {
    switch (action.type) {
        case 'FILES/SET-REQUEST-STATUS': {
            return {
                ...state,
                requestStatus: action.requestStatus,
                error: action.requestStatus === 'success'
                    ? ''
                    : state.error
            }
        }
        case 'FILES/SET-ERROR': {
            return {
                ...state,
                error: action.error
            }
        }
        default:
            return state
    }
}

//action creators
const setRequestStatusAC = (requestStatus: RequestStatusType) => ({
    type: 'FILES/SET-REQUEST-STATUS',
    requestStatus
} as const)
const setErrorAC = (error: string) => ({type: 'FILES/SET-ERROR', error} as const)

//thunk
export const getFileTC = (fileName: string) => (dispatch: ThunkCustomDispatch) => { //скачиваем файл с сервера на устройство
    dispatch(setRequestStatusAC('loading'))
    filesAPI.getFile()
        .then(({data}) => {
            const blob = new Blob([data], {type: 'image/jpeg'})
            // создаём ссылку на файл
            const downloadUrl = window.URL.createObjectURL(blob)
            // создаём тег "ссылка" на наш файл
            const link = document.createElement('a')
            link.href = downloadUrl
            // добавляем атрибуты нашему тегу: загрузочный, имя файла
            link.setAttribute('download', fileName)
            // добавляем тег в документ
            document.body.appendChild(link)
            // кликаем по ссылке
            link.click()
            // удаляем тег из документа
            link.remove()

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

export const sendFileTC = (file: FormData) => (dispatch: ThunkCustomDispatch) => {
    dispatch(setRequestStatusAC('loading'))
    filesAPI.sendFile(file)
        .then(() => {
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
export type FilesStateType = typeof initialState
//объединение типов actionов:
export type ActionsType =
    | ReturnType<typeof setRequestStatusAC>
    | ReturnType<typeof setErrorAC>


// тип диспатча:
type ThunkCustomDispatch = Dispatch<ActionsType>