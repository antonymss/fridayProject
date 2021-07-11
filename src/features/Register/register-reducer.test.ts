import {registerReducer} from "./register-reducer";

let state = {
    responseText: 'some error',
    isRegistration: false
}

it(`response text is set successfully`, () => {
    let newState = registerReducer(state, {type: 'REGISTER/SET-RESPONSE-TEXT', text: "bad request"})

    expect(newState.responseText).toBe("bad request")
    expect(newState.isRegistration).toBeFalsy()
})

it(`response text clears when 'isRegistration' status is truthy`, () => {
    let newState = registerReducer(state, {type: 'REGISTER/SET-REGISTRATION', isRegistration: true})

    expect(newState.isRegistration).toBeTruthy()
    expect(newState.responseText).toBe('')
})