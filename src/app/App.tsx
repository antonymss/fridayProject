import React from 'react';
import './App.css';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Forgot} from "../features/Forgot/Forgot";
import {Login} from "../features/Login/Login";
import {Register} from "../features/Register/Register";
import {SetPassword} from "../features/SetPassword/SetPassword";
import {Profile} from "../features/Profile/Profile";
import {Header} from "../features/Header/Header";

const App = () => {
  return (
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path={['/', '/login']} render={() => <Login/>}/>
        <Route path={'/register'} render={() => <Register/>}/>
        <Route path={'/forgot'} render={() => <Forgot/>}/>
        <Route path={'/set-new-password/:token?'} render={() => <SetPassword/>}/>
        <Route path={'/profile'} render={() => <Profile/>}/>
        <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
        <Redirect from={'*'} to={'/404'}/>

      </Switch>
    </div>
  );
}

export default App;
