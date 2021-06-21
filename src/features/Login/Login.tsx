import React from "react";
import style from "./Login.module.css"
import {NavLink, Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {useFormik} from "formik";
import {InitialAuthStateType, loginTC} from "./auth-reducer";
import {PATH} from "../../app/App";
import {Form} from "antd";
import commonStyle from "../../common/styles/error.module.css";


export const Login = () => {

    const dispatch = useDispatch()
    const {isLoggedIn, requestStatus, error} = useSelector<AppRootStateType, InitialAuthStateType>(state => state.auth)

    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                return {
                    email: "Email is required"
                }
            }
            if (!values.password) {
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

    if (isLoggedIn) {
        return <Redirect to={PATH.PROFILE}/>
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>

                <div className={style.login}>
                    <Form.Item className={style.notice}>
                        <p>To log in, please get registered
                            <NavLink to={PATH.REGISTER} activeClassName={style.active}> here,</NavLink>
                        </p>
                        <p>or please use common test account credentials:</p>
                        <p>Email: nya-admin@nya.nya</p>
                        <p>Password: 1qazxcvBG</p>
                    </Form.Item>
                    {requestStatus === 'loading' && <div className={style.loading}>loading...</div>}
                    <div className={error && commonStyle.error}>{error}</div>
                    <label>Email</label>
                    <input type="email" {...formik.getFieldProps("email")}/>
                    {formik.errors.email ? <div className={style.error}>{formik.errors.email}</div> : null}

                    <label>Password</label>
                    <input type="password" {...formik.getFieldProps("password")}/>
                    {formik.errors.password ? <div className={style.error}>{formik.errors.password}</div> : null}

                    <NavLink to="/forgot" activeClassName={style.active}>Forgot password?</NavLink>

                    <label>Remember Me<input type="checkbox" {...formik.getFieldProps("rememberMe")}
                                             checked={formik.values.rememberMe}/></label>

                    <button type={'submit'} color={'primary'}>Login</button>
                    <NavLink to="/register" activeClassName={style.active}>Registration</NavLink>
                </div>
            </form>
        </div>

    )
}