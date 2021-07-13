import {SortDirections} from "../../api/api";
import {RequestStatusType} from "../Login/auth-reducer";
import {setCurrentUserDataAC, setUsersAC, usersReducer} from "./users-reducer";

//initial state
let state = {
    users: [
        {
            _id: '001', avatar: 'img23', created: '01may', email: 'nsjs@km.to',
            isAdmin: false, name: 'miho', publicCardPacksCount: 3, updated: '4may',
            verified: false
        },
        {
            _id: '002', avatar: 'img65', created: '03march', email: 'dths@kg.tr',
            isAdmin: false, name: 'rita', publicCardPacksCount: 7, updated: '5may',
            verified: false
        }
    ],
    maxPublicCardPacksCount: 80,
    minPublicCardPacksCount: 0,
    page: 1,
    pageCount: 10,
    usersTotalCount: 0,
    requestStatus: 'idle' as RequestStatusType,
    error: "network error",
    sortParams: {
        userName: '',
        minPublicCardPacksCount: undefined,
        maxPublicCardPacksCount: undefined,
        sortDirection: undefined,
        propToSortBy: '',
        page: undefined,
        pageCount: undefined
    },
    currentUserData: {
        _id: "",
        email: "",
        name: "",
        avatar: ""
    }
}
//tests
it('new users are set successfully', () => {
    let newUsers = [{
        _id: '005', avatar: 'img788', created: '14march', email: 'dre@uy.op',
        isAdmin: false, name: 'tyge', publicCardPacksCount: 2, updated: '5apr',
        verified: false
    }]
    let action = setUsersAC({users: newUsers, page: 2, pageCount: 20, minPublicCardPacksCount: 2,
        maxPublicCardPacksCount: 15, usersTotalCount: 1})

    let newState = usersReducer(state, action)

    expect(newState.users.length).toBe(1)
    expect(newState.users[1]).toBeUndefined()
    expect(newState.users[0].name).toBe("tyge")
    expect(newState.usersTotalCount).toBe(1)
    expect(newState.pageCount).toBe(20)
})

it(`error message clears when request status is set to "success"`, () => {
    let newState = usersReducer(state, {type: 'USERS/SET-REQUEST-STATUS', requestStatus: "success"})

    expect(newState.requestStatus).toBe("success")
    expect(newState.error).toBe('')
})

it(`error message is set successfully`, () => {
    let newState = usersReducer(state, {type: 'USERS/SET-ERROR', error: "some error"})

    expect(newState.error).toBe("some error")
    expect(newState.requestStatus).toBe('idle')
})

it(`parameters for sorting users are set successfully`, () => {
    let newSortParams = {
        userName: 'ri',
        minPublicCardPacksCount: 2,
        maxPublicCardPacksCount: 11,
        sortDirection: SortDirections.Up,
        propToSortBy: 'publicCardPacksCount',
        page: 3,
        pageCount: 40
    }

    let newState = usersReducer(state, {type: 'USERS/SET-SORT-PARAMS', sortParams: newSortParams})

    expect(newState.sortParams.userName).toBe('ri')
    expect(newState.sortParams.sortDirection).toBe(0)
    expect(newState.sortParams.maxPublicCardPacksCount).toBe(11)
    expect(newState.sortParams.propToSortBy).toBe('publicCardPacksCount')
})

it(`current user data are set successfully`, () => {
    let action = setCurrentUserDataAC("576",
        "dg@yu.ry",
        "dilan",
        "img")

    let newState = usersReducer(state, action)

    expect(newState.currentUserData._id).toBe('576')
    expect(newState.currentUserData.name).toBe('dilan')
    expect(newState.sortParams.maxPublicCardPacksCount).toBeUndefined()
    expect(newState.sortParams.propToSortBy).toBe('')
})
