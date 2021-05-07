import React from "react";
import style from "./Login.module.css"
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {useFormik} from "formik";
import { Redirect } from 'react-router-dom';
import {loginTC} from "./auth-reducer";

// export const Login1 = () => {
//     return (
//         <div className={style.login}>
//             Log In
//             <input type="email"/>
//             <input type="password"/>
//             <NavLink to="/forgot" activeClassName={style.active}>Forgot password?</NavLink>
//             <label><input type="checkbox"/>Remember Me</label>
//             <button>Log in</button>
//             <NavLink to="/register" activeClassName={style.active}>Registration</NavLink>
//         </div>
//     );
// }
export const Login = () => {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        validate: (values) => {
            if(!values.email) {
                return {
                    email: "Email is required"
                }
            }
            if(!values.password) {
                return {
                    password: "Password is required"
                }
            }
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: values => {
           dispatch(loginTC(values))
        },
    })


    if(isLoggedIn) {
        return <Redirect to={"/profile"}/>
    }
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className={style.login}>

                <label>Email</label>
                <input type="email" {...formik.getFieldProps("email")}/>
                {formik.errors.email ? <div className={style.error}>{formik.errors.email}</div> : null}

                <label>Password</label>
                <input type="password" {...formik.getFieldProps("password")}/>
                {formik.errors.password ? <div className={style.error}>{formik.errors.password}</div> : null}

                <NavLink to="/forgot" activeClassName={style.active}>Forgot password?</NavLink>

                <label>Remember Me<input type="checkbox" {...formik.getFieldProps("rememberMe")}
                checked={formik.values.rememberMe} /></label>

                <button type={'submit'} color={'primary'}>Login</button>
                <NavLink to="/register" activeClassName={style.active}>Registration</NavLink>
            </div>
        </form>

    )
}