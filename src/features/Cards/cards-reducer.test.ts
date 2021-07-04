import {cardsReducer, setCardsAC, setNewGradeAC} from "./cards-reducer";
import {SortDirections} from "../../api/api";
import {RequestStatusType} from "../Login/auth-reducer";

//initial state
const state = {
    requestStatus: 'idle' as RequestStatusType, //изначально статус запроса - 'idle' (неактивный)
    error: 'network error',
    cards: [{
        _id: "001", question: "what?", answer: "nothing", grade: 2, answerImg: "0",
        cardsPack_id: "60abf4517efa6100041db9bc", comments: "", created: new Date(),
        questionImg: "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD", rating: 0, shots: 0, type: "card",
        updated: new Date(), user_id: "608fda0af07a130004b5c500"
    },
        {
            _id: "002", question: "who?", answer: "her", grade: 5, answerImg: "0",
            cardsPack_id: "60abf4517efa6100041db9bc", comments: "", created: new Date(),
            questionImg: "data:image/png;base64,/005", rating: 0, shots: 0, type: "card",
            updated: new Date(), user_id: "608fda0af07a130004b5c500"
        }],
    packUserId: "100",
    cardsTotalCount: 0,
    page: 1,
    pageCount: 10,
    sortParams: {
        question: '',
        answer: '',
        sortDirection: SortDirections.Down,
        propToSortBy: undefined,
        minGrade: 0,
        maxGrade: 5,
        page: 1,
        pageCount: 10
    },
}
//tests
it('new cards are set successfully', () => {
    let newCards = [{
        _id: "014", question: "when?", answer: "today", grade: 3, answerImg: "0",
        cardsPack_id: "758", comments: "", created: new Date(),
        questionImg: "data:image/png;base64,/005", rating: 0, shots: 2, type: "card",
        updated: new Date(), user_id: "130"
    }]
    let action = setCardsAC(newCards, '130', 2, 1, 20)

    let newState = cardsReducer(state, action)

    expect(newState.cards.length).toBe(1)
    expect(newState.cards[1]).toBeUndefined()
    expect(newState.cards[0].question).toBe("when?")
    expect(newState.packUserId).toBe("130")
    expect(newState.pageCount).toBe(20)
})

it(`error message clears when request status is set to "success"`, () => {
    let newState = cardsReducer(state, {type: 'CARDS/SET-REQUEST-STATUS', requestStatus: "success"})

    expect(newState.requestStatus).toBe("success")
    expect(newState.error).toBe('')
})

it(`error message is set successfully`, () => {
    let newState = cardsReducer(state, {type: 'CARDS/SET-ERROR', error: "some error"})

    expect(newState.error).toBe("some error")
    expect(newState.requestStatus).toBe('idle')
})

it(`parameters for sorting cards are set successfully`, () => {
    let newSortParams = {
        question: 'a',
        answer: '',
        sortDirection: SortDirections.Up,
        propToSortBy: 'updated' as "grade" | "updated" | undefined,
        minGrade: 0,
        maxGrade: 5,
        page: 1,
        pageCount: 10
    }

    let newState = cardsReducer(state, {type: 'CARDS/SET-SORT-PARAMS', sortParams: newSortParams})

    expect(newState.sortParams.question).toBe("a")
    expect(newState.sortParams.sortDirection).toBe(0)
    expect(newState.sortParams.propToSortBy).toBeDefined()
})

it(`grade changed for the correct card`, () => {
    let action = setNewGradeAC(3, '002')

    let newState = cardsReducer(state, action)

    expect(newState.cards[1].grade).toBe(3)
    expect(newState.cards[0].grade).toBe(2)
    expect(newState.cards.length).toBe(2)
})