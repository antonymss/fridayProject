import axios from 'axios'

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://neko-back.herokuapp.com/2.0/'
}) //перед каждым pushем на gitHub менять baseURL с http://localhost:7542/2.0/ на https://neko-back.herokuapp.com/2.0/ !

export const authAPI = {
    me() { // проверка на залогиненность
        return instance.post<AuthUserData>(`auth/me`)
    },
    login(loginData: LoginDataType) {
        return instance.post<AuthUserData>(`auth/login`, loginData)
    },
    register(regData: RegDataType) {
        return instance.post<{ addedUser: {}, error?: string }>(`auth/register`, regData)
    },
    logout() {
        return instance.delete<ResponseType>(`auth/me`)
    },
    updateUserData(newUserData: NewUserDataType) { // обновление name или аватарки юзера
        return instance.put<{ updatedUser: {}, error?: string }>(`auth/me`, newUserData)
    },
    sendEmailToResetPass(email: string) { // отправляем емайл, если забыл пароль, со страницы Forgot
        return instance.post<ResponseType>(`auth/forgot`, {
            email,
            from: "test-front-admin <ai73a@yandex.by>",
            message: `<div style="background-color: lime; padding: 15px">
                 password recovery link:
                 <a href='http://marygrishchuk.github.io/cards-by-dream-team/#/set-new-password/$token$'>
                 Reset Password</a></div>`
        })
    },
    resetPassword(resetPassData: ResetPassDataType) { // отправка нового пароля со страницы Set New Password
        return instance.post<ResponseType>(`auth/set-new-password`, resetPassData)
    }
}

export const packsAPI = {
    getPacks(params: GetSortedPacksType = {}) { // получение колод
        const {
            nameToSearch = '', maxCardsCount = '', minCardsCount = '', page = '', pageCount = '',
            sortDirection = '', propToSortBy = '', userId = ''
        } = params
        return instance.get<GetPackResponseType>(`cards/pack?packName=${nameToSearch}&sortPacks=${sortDirection}` +
            `${propToSortBy}&min=${minCardsCount}&max=${maxCardsCount}&page=${page}&pageCount=${pageCount}&user_id=${userId}`)
    },
    addPack(name?: string, isPrivate?: boolean, deckCover?: string) {  // добавление (создание) колоды
        return instance.post<AddPackResponseType>(`cards/pack`, {cardsPack: {name, private: isPrivate, deckCover}})
    },
    deletePack(packId: string) { //удаление колоды
        return instance.delete<DeletePackResponseType>(`cards/pack?id=${packId}`)
    },
    updatePack(packId: string, name?: string) { //изменение колоды
        return instance.put<UpdatePackResponseType>(`cards/pack`, {cardsPack: {_id: packId, name}})
    },
}

export const cardsAPI = {
    getCards(packId: string, params: GetSortedCardsType = {}) { // получение карточек по id колоды
        const {
            question = '', answer = '', sortDirection = '', propToSortBy = '', minGrade = '',
            maxGrade = '', page = '', pageCount = ''
        } = params
        return instance.get<GetCardsResponseType>(`cards/card?cardsPack_id=${packId}&cardQuestion=${question}` +
            `&cardAnswer=${answer}&sortCards=${sortDirection}${propToSortBy}&min=${minGrade}&max=${maxGrade}` +
            `&page=${page}&pageCount=${pageCount}
`)
    },
    addCard(packId: string, params: NewCardDataType = {}) {  // добавление (создание) карточки
        const {
            question, answer, grade, shots, rating, answerImg, questionImg,
            questionVideo, answerVideo, type
        } = params
        return instance.post(`cards/card`, {
            card: {
                cardsPack_id: packId, question, answer, grade, shots,
                rating, answerImg, questionImg, questionVideo, answerVideo, type
            }
        })
    },
    deleteCard(cardId: string) { //удаление карточки
        return instance.delete(`cards/card?id=${cardId}`)
    },
    updateCard(cardId: string, params: NewCardDataType = {}, comments?: string) { //изменение карточки
        const {
            question, answer, grade, shots, rating, answerImg, questionImg,
            questionVideo, answerVideo, type
        } = params
        return instance.put(`cards/card`, {
            card: {
                _id: cardId, question, answer, grade, shots,
                rating, answerImg, questionImg, questionVideo, answerVideo, type, comments
            }
        })
    },
}

//types
export type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}
export type RegDataType = {
    email: string
    password: string
}
export type NewUserDataType = {
    name: string
    avatar?: string
}
export type ResetPassDataType = {
    password: string
    resetPasswordToken: string | undefined
}
export type AuthUserData = {
    _id: string
    email: string
    name: string
    avatar?: string
    publicCardPacksCount: number
    created: Date
    updated: Date
    verified: boolean
    rememberMe: boolean
    error?: string
}
export type ResponseType = {
    info: string
    error?: string
}

export type GetPackResponseType = {
    cardPacks: Array<PackDataType>
    cardPacksTotalCount: number
    maxCardsCount: number
    minCardsCount: number
    page: number
    pageCount: number
    token: string
    tokenDeathTime: number

}

export type PackDataType = {
    _id: string
    name: string
    cardsCount: number
    created: Date
    updated: Date
    user_id: string
    user_name: string
    deckCover: string
    grade: number
    path: string
    private: boolean
    rating: number
    shots: number
    type: string
}

export type NewPackType = {
    name?: string
    deckCover?: string
    private?: boolean
}

export type AddPackResponseType = {
    newCardsPack: PackDataType
    token: string
    tokenDeathTime: number
}
export type DeletePackResponseType = {
    deletedCardsPack: PackDataType
    token: string
    tokenDeathTime: number
}
export type UpdatePackResponseType = {
    updatedCardsPack: PackDataType
    token: string
    tokenDeathTime: number
}

export type GetCardsResponseType = {
    cards: Array<CardDataType>
    cardsTotalCount: number
    maxGrade: number
    minGrade: number
    page: number
    pageCount: number
    packUserId: string
}

export type CardDataType = {
    _id: string
    question: string
    answer: string
    cardsPack_id: string
    grade: number
    rating: number
    shots: number
    type: string
    user_id: string
    created: Date
    updated: Date
}

export enum SortDirections {
    Up = 0,
    Down = 1,
}

export type GetSortedPacksType = {
    nameToSearch?: string
    minCardsCount?: string
    maxCardsCount?: string
    sortDirection?: SortDirections
    propToSortBy?: "name" | "cardsCount"
    page?: number
    pageCount?: number
    userId?: string
}
export type GetSortedCardsType = {
    question?: string
    answer?: string
    sortDirection?: SortDirections
    propToSortBy?: "grade"
    minGrade?: string
    maxGrade?: string
    page?: number
    pageCount?: number
}

export type NewCardDataType = {
    question?: string
    answer?: string
    grade?: 0 | 1 | 2 | 3 | 4 | 5
    shots?: number
    rating?: number
    answerImg?: string
    questionImg?: string
    questionVideo?: string
    answerVideo?: string
    type?: "card"
}
