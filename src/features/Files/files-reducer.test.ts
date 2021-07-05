import {RequestStatusType} from "../Login/auth-reducer";
import {filesReducer} from "./files-reducer";


let state = {
    requestStatus: 'idle' as RequestStatusType,
    error: "network error"
}

it(`request status changes to "loading"`, () => {
    let newState = filesReducer(state, {type: 'FILES/SET-REQUEST-STATUS', requestStatus: "loading"})

    expect(newState.requestStatus).toBe("loading")
    expect(newState.error).toBe("network error")
})

it(`error message clears when request status is set to "success"`, () => {
    let newState = filesReducer(state, {type: 'FILES/SET-REQUEST-STATUS', requestStatus: "success"})

    expect(newState.requestStatus).toBe("success")
    expect(newState.error).toBe("")
})

it(`error message is set successfully`, () => {
    let newState = filesReducer(state, {type: 'FILES/SET-ERROR', error: "another error"})

    expect(newState.error).toBe("another error")
    expect(newState.requestStatus).toBe('idle')
})