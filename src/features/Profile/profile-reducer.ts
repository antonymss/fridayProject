const initialState = {
    //
}

export const profileReducer = (state: InitialStateType = initialState, action: any): InitialStateType => {
    switch (action.type) {
        //cases
        default:
            return state
    }
} // (при создании кейсов заменить "action: any" на общий тип actionов (ниже) "action: ActionsType")

//action creators
// export const setSomethingAC = () => ({type: 'PROFILE/SET-SOMETHING'} as const)

//thunk
// export const doSomethingTC = () => (dispatch: ThunkDispatch) => {
//
// }

//types
export type InitialStateType = typeof initialState
//объединение типов actionов:
// export type ActionsType = ReturnType<typeof setSomethingAC>
// тип диспатча:
// type ThunkDispatch = Dispatch<ReturnType<typeof setSomethingAC>>