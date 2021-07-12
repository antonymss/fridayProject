import {setPasswordReducer} from "./set-password-reducer";
import {RequestStatusType} from "../Login/auth-reducer";

//initial state
let state = {
    requestStatus: 'idle' as RequestStatusType, //изначально статус запроса - "неактивный"
    error: 'bad request',
    info: 'password is reset'
}
//tests
it('request status is set successfully', () => {
    let newState = setPasswordReducer(state, {type: 'SET-PASSWORD/SET-REQUEST-STATUS', requestStatus: "loading"})

    expect(newState.requestStatus).toBe('loading')
    expect(newState.error).toBe('bad request')
})

it(`error message clears when request status is set to "success"`, () => {
    let newState = setPasswordReducer(state, {type: 'SET-PASSWORD/SET-REQUEST-STATUS', requestStatus: "success"})

    expect(newState.requestStatus).toBe("success")
    expect(newState.error).toBe('')
})

it(`info clears when error message is set`, () => {
    let newState = setPasswordReducer(state, {type: 'SET-PASSWORD/SET-ERROR', error: "another error"})

    expect(newState.error).toBe("another error")
    expect(newState.info).toBe("")
})

it(`error message clears when info is set`, () => {
    let newState = setPasswordReducer(state, {type: 'SET-PASSWORD/SET-INFO', info: "useful info"})

    expect(newState.info).toBe("useful info")
    expect(newState.error).toBe("")
})