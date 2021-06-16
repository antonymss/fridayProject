import React, {useEffect} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Forgot} from "../features/Forgot/Forgot";
import {Login} from "../features/Login/Login";
import {Register} from "../features/Register/Register";
import {SetPassword} from "../features/SetPassword/SetPassword";
import {Profile} from "../features/Profile/Profile";
import {Header} from "../features/Header/Header";
import {Packs} from "../features/Packs/Packs";
import {Cards} from "../features/Cards/Cards";
import {initializeAppTC} from "./app-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {Learn} from "../features/Learn/Learn";
import {ScrollUpModal} from '../features/Modals/ScrollUpModal/ScrollUpModal';
import {TeamPresentation} from "../preloader/TeamPresentation/TeamPresentation";
import {Files} from "../features/Files/Files";
import {Page404} from "../features/Page404/Page404";
import {Users} from "../features/Users/Users";
import {MapPage} from "../features/MapPage/MapPage";

export const PATH = {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT: "/forgot",
    SET_PASSWORD: "/set-new-password",
    PROFILE: "/profile",
    PACKS: "/packs",
    CARDS: "/cards",
    LEARN: "/learn",
    FILES: "/files",
    USERS: "/users",
    MAP: "/map",
}

const App = () => {
    let isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    let dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <TeamPresentation/>
    }

    return (
        <div className="App">
            <Header/>
            <Switch>
                <Route exact path={['/', `${PATH.PROFILE}/:userId?`]} render={() => <Profile/>}/>
                <Route path={PATH.REGISTER} render={() => <Register/>}/>
                <Route path={PATH.FORGOT} render={() => <Forgot/>}/>
                <Route path={`${PATH.SET_PASSWORD}/:token?`} render={() => <SetPassword/>}/>
                <Route path={PATH.LOGIN} render={() => <Login/>}/>
                <Route path={PATH.PACKS} render={() => <Packs/>}/>
                <Route path={`${PATH.CARDS}/:packId?`} render={() => <Cards/>}/>
                <Route path={`${PATH.LEARN}/:packId?`} render={() => <Learn/>}/>
                <Route path={PATH.FILES} render={() => <Files/>}/>
                <Route path={PATH.USERS} render={() => <Users/>}/>
                <Route path={PATH.MAP} render={() => <MapPage/>}/>
                <Route path={'/404'} render={() => <Page404/>}/>
                <Redirect from={'*'} to={'/404'}/>
            </Switch>
            {/*кнопка для скролла вверх появится только, если юзер промотал вниз на 400px*/}
            <ScrollUpModal/>
        </div>
    );
}

export default App;
