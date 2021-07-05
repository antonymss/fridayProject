import {RequestStatusType} from "../Login/auth-reducer";
import {forgotReducer} from "./forgot-reducer";


let state = {
    requestStatus: 'idle' as RequestStatusType, //изначально статус запроса - "неактивный"
    error: 'network error',
    info: 'you are registered'
}

it(`request status changes to "loading"`, () => {
    let newState = forgotReducer(state, {type: 'FORGOT/SET-REQUEST-STATUS', requestStatus: "loading"})

    expect(newState.requestStatus).toBe("loading")
    expect(newState.error).toBe("network error")
})

it(`error message clears when request status is set to "success"`, () => {
    let newState = forgotReducer(state, {type: 'FORGOT/SET-REQUEST-STATUS', requestStatus: "success"})

    expect(newState.requestStatus).toBe("success")
    expect(newState.error).toBe("")
})

it(`info clears when error message is set`, () => {
    let newState = forgotReducer(state, {type: 'FORGOT/SET-ERROR', error: "another error"})

    expect(newState.error).toBe("another error")
    expect(newState.info).toBe("")
})

it(`error message clears when info is set`, () => {
    let newState = forgotReducer(state, {type: 'FORGOT/SET-INFO', info: "the email is sent"})

    expect(newState.info).toBe("the email is sent")
    expect(newState.error).toBe("")
})