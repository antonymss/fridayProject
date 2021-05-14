import React from 'react';
import './App.css';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Forgot} from "../features/Forgot/Forgot";
import {Login} from "../features/Login/Login";
import {Register} from "../features/Register/Register";
import {SetPassword} from "../features/SetPassword/SetPassword";
import {Profile} from "../features/Profile/Profile";
import {Header} from "../features/Header/Header";
import {Packs} from "../features/Packs/Packs";
import {Cards} from "../features/Cards/Cards";

export const PATH = {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT: "/forgot",
    SET_PASSWORD: "/set-new-password",
    PROFILE: "/profile",
    PACKS: "/packs",
    CARDS: "/cards",
}

const App = () => {
  return (
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path={['/', `${PATH.LOGIN}`]} render={() => <Login/>}/>
        <Route path={PATH.REGISTER} render={() => <Register/>}/>
        <Route path={PATH.FORGOT} render={() => <Forgot/>}/>
        <Route path={`${PATH.SET_PASSWORD}/:token?`} render={() => <SetPassword/>}/>
        <Route path={PATH.PROFILE} render={() => <Profile/>}/>
        <Route path={PATH.PACKS} render={() => <Packs/>}/>
        <Route path={`${PATH.CARDS}/:packId?`} render={() => <Cards/>}/>
        <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
        <Redirect from={'*'} to={'/404'}/>

      </Switch>
    </div>
  );
}

export default App;
