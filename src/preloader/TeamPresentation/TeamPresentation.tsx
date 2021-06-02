import React from "react";
import style from "./TeamPresentation.module.css";
import maria from "../../assets/images/maria.jpeg"
import leonid from "../../assets/images/leonid.jpg";
import anton from "../../assets/images/anton.png";

export const TeamPresentation = React.memo(() => {

    return (
        <div className={style.teamPresentation}>
            <div className={style.section}>Dream Team</div>
            <div className={style.avatars}>
                <div className={style.maria} style={{backgroundImage: `url(${maria})`}}> </div>
                <div className={style.leonid} style={{backgroundImage: `url(${leonid})`}}> </div>
                <div className={style.anton} style={{backgroundImage: `url(${anton})`}}> </div>
            </div>
            <div className={style.section}>Presents...</div>
        </div>
    );
})