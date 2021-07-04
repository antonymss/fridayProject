import {appReducer, setAppErrorAC, setAppStatusAC, setIsInitializedAC} from "./app-reducer";
import {RequestStatusType} from "../features/Login/auth-reducer";

let state = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

it('app initializes successfully', () => {
    let action = setIsInitializedAC(true)

    let newState = appReducer(state, action)

    expect(newState.isInitialized).toBeTruthy()
    expect(newState.status).toBe('idle')
})

it(`request status changes to "loading"`, () => {
    let action = setAppStatusAC("loading")

    let newState = appReducer(state, action)

    expect(newState.status).toBe("loading")
    expect(newState.error).toBeNull()
})

it(`error message is set successfully`, () => {
    let action = setAppErrorAC("network error")

    let newState = appReducer(state, action)

    expect(newState.error).toBe("network error")
    expect(newState.status).toBe('idle')
})