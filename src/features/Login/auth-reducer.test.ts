import {authReducer, RequestStatusType, setAuthUserDataAC} from "./auth-reducer";

//initial state
let state = {
    _id: "",
    email: "",
    name: "",
    avatar: "" as string | undefined,
    error: "bad request",
    isLoggedIn: false,
    requestStatus: 'idle' as RequestStatusType //изначально статус запроса - "неактивный"
}
//tests
it('authorized user data are set successfully', () => {
    let action = setAuthUserDataAC('34', 'fsf@gmail.com', 'cat', 's002', true)

    let newState = authReducer(state, action)

    expect(newState.name).toBe('cat')
    expect(newState.isLoggedIn).toBeTruthy()
    expect(newState.email).toBe('fsf@gmail.com')
    expect(newState.requestStatus).toBe('idle')
})

it(`error message clears when request status is set to "success"`, () => {
    let newState = authReducer(state, {type: 'AUTH/SET-REQUEST-STATUS', requestStatus: "success"})

    expect(newState.requestStatus).toBe("success")
    expect(newState.error).toBe('')
})

it(`error message is set successfully`, () => {
    let newState = authReducer(state, {type: 'AUTH/SET-ERROR', error: "network error"})

    expect(newState.error).toBe("network error")
    expect(newState.requestStatus).toBe('idle')
})