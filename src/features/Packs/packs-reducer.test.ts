import {SortDirections} from "../../api/api";
import {RequestStatusType} from "../Login/auth-reducer";
import {packsReducer, setPacksAC} from "./packs-reducer";

//initial state
let state = {
    cardPacks: [
        {
            _id: '001', name: 'english', cardsCount: 3,
            created: new Date(), updated: new Date(), user_id: '152',
            user_name: 'user34', deckCover: 'image_url1', grade: 5, path: '',
            private: false, rating: 0, shots: 0, type: 'pack'
        },
        {
            _id: '002', name: 'history', cardsCount: 5,
            created: new Date(), updated: new Date(), user_id: '475',
            user_name: 'user63', deckCover: 'image_url2', grade: 4, path: '',
            private: false, rating: 0, shots: 0, type: 'pack'
        }
    ],
    requestStatus: 'idle' as RequestStatusType,
    error: "some error",
    cardPacksTotalCount: 2,
    page: 1,
    pageCount: 10,
    sortParams: {
        nameToSearch: '',
        minCardsCount: 0,
        maxCardsCount: 100,
        sortDirection: SortDirections.Down,
        propToSortBy: undefined,
        page: 1,
        pageCount: 10,
        userId: ''
    }
}
//tests
it('new packs are set successfully', () => {
    let newPacks = [{
        _id: '045', name: 'riddles', cardsCount: 7,
        created: new Date(), updated: new Date(), user_id: '342',
        user_name: 'user74', deckCover: 'image_url5', grade: 3, path: '',
        private: false, rating: 0, shots: 0, type: 'pack'
    }]
    let action = setPacksAC(newPacks, 1, 1, 30)

    let newState = packsReducer(state, action)

    expect(newState.cardPacks.length).toBe(1)
    expect(newState.cardPacks[1]).toBeUndefined()
    expect(newState.cardPacks[0].name).toBe("riddles")
    expect(newState.cardPacksTotalCount).toBe(1)
    expect(newState.pageCount).toBe(30)
})

it(`error message clears when request status is set to "success"`, () => {
    let newState = packsReducer(state, {type: 'PACKS/SET-REQUEST-STATUS', requestStatus: "success"})

    expect(newState.requestStatus).toBe("success")
    expect(newState.error).toBe('')
})

it(`error message is set successfully`, () => {
    let newState = packsReducer(state, {type: 'PACKS/SET-ERROR', error: "network error"})

    expect(newState.error).toBe("network error")
    expect(newState.requestStatus).toBe('idle')
})

it(`parameters for sorting packs are set successfully`, () => {
    let newSortParams = {
        nameToSearch: 'eng',
        minCardsCount: 1,
        maxCardsCount: 4,
        sortDirection: SortDirections.Up,
        propToSortBy: 'name' as "name" | "cardsCount" | undefined,
        page: 1,
        pageCount: 10,
        userId: ''
    }

    let newState = packsReducer(state, {type: 'PACKS/SET-SORT-PARAMS', sortParams: newSortParams})

    expect(newState.sortParams.nameToSearch).toBe('eng')
    expect(newState.sortParams.sortDirection).toBe(0)
    expect(newState.sortParams.minCardsCount).toBe(1)
    expect(newState.sortParams.propToSortBy).toBeDefined()
})

