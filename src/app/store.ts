import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from "redux-thunk";
import {authReducer} from "../features/Login/auth-reducer";
import {registerReducer} from "../features/Register/register-reducer";
import {setPasswordReducer} from "../features/SetPassword/set-password-reducer";
import {profileReducer} from "../features/Profile/profile-reducer";
import {forgotReducer} from "../features/Forgot/forgot-reducer";
import {packsReducer} from "../features/Packs/packs-reducer";
import {cardsReducer} from "../features/Cards/cards-reducer";

// комбайним редюсеры
const rootReducer = combineReducers({  //стейт
    auth: authReducer,
    register: registerReducer,
    forgot: forgotReducer,
    setPassword: setPasswordReducer,
    profile: profileReducer,
    packs: packsReducer,
    cards: cardsReducer
})
//создаем store
export const store = createStore(rootReducer, applyMiddleware(thunk));

//тип стейта
export type AppRootStateType = ReturnType<typeof rootReducer>

// для вызова store из консоли
// @ts-ignore
window.store = store;
