import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from "redux-thunk";
import {authReducer} from "../features/Login/auth-reducer";
import {registerReducer} from "../features/Register/register-reducer";
import {setPasswordReducer} from "../features/SetPassword/set-password-reducer";
import {forgotReducer} from "../features/Forgot/forgot-reducer";
import {packsReducer} from "../features/Packs/packs-reducer";
import {cardsReducer} from "../features/Cards/cards-reducer";
import {appReducer} from "./app-reducer";
import {filesReducer} from "../features/Files/files-reducer";
import {usersReducer} from "../features/Users/users-reducer";

// комбайним редюсеры
const rootReducer = combineReducers({  //стейт
    auth: authReducer,
    register: registerReducer,
    forgot: forgotReducer,
    setPassword: setPasswordReducer,
    packs: packsReducer,
    cards: cardsReducer,
    app: appReducer,
    files: filesReducer,
    users: usersReducer
})
//создаем store
export const store = createStore(rootReducer, applyMiddleware(thunk));

//тип стейта
export type AppRootStateType = ReturnType<typeof rootReducer>

// для вызова store из консоли
// @ts-ignore
window.store = store;
