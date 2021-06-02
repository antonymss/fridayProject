import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://dry-forest-56016.herokuapp.com/'
})

export const filesAPI = {
    getFile() { // получение файла
        return instance.get(`file`, {responseType: 'blob'})
    },
    sendFile(file: FormData) {  // отправка файла
        return instance.post<FileResponseType>(`file`, file)
    }
}

//types
type FileResponseType = {
    fileName: string
    success: boolean
}