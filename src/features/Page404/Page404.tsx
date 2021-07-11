import React from "react";
import style from "./Page404.module.css";
import {useHistory} from "react-router-dom";
import ghost from "../../assets/images/ghost.png";
import shadow from "../../assets/images/shadow.png";

export const Page404 = () => {
    const history = useHistory()

    return (
        <div className={style.page404}>
            <h3 className={style.goBack}>
                <button onClick={() => history.goBack()}>⏴ Back</button>
            </h3>
            <div className={style.bigError}>error</div>
            <div className={style.ghostContainer}>
                <div className={style.ghostWithShadow}>
                    <img className={style.ghost} src={ghost} alt={'ghost'}/>
                    <img className={style.shadow} src={shadow} alt={'shadow'}/>
                </div>
                <h2 className={style.errorTitle}>Page not found</h2>
                <h6 className={style.errorDescription}>
                    <p>The page you are looking for might have been removed,
                        had its name changed, </p>
                    <p>or is temporarily unavailable.</p>
                </h6>
            </div>
        </div>
    )
}