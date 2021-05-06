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
        return instance.post<{addedUser: {}, error?: string}>(`auth/register`, regData)
    },
    logout() {
        return instance.delete<ResponseType>(`auth/me`)
    },
    updateUserData(newUserData: NewUserDataType) { // обновление name или аватарки юзера
        return instance.put<{updatedUser: {}, error?: string}>(`auth/me`, newUserData)
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