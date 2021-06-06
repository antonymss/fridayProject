import React, {useEffect, useState} from "react";
import style from "./Learn.module.css";
import {NavLink, Redirect, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {CardDataType, PackDataType} from "../../api/api";
import {CardsStateType, getCardsTC, setCardsAC, updateGradeTC} from "../Cards/cards-reducer";
import {PATH} from "../../app/App";
import {Modal} from "../../common/Modal/Modal";
import {getRandomCard} from "../../utils/get-random-card";
import commonStyle from "../../common/styles/error.module.css";



export const Learn = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const history = useHistory()
    const [showAnswer, setShowAnswer] = useState<boolean>(false)
    const {packId} = useParams<{ packId?: any }>()    //читаем id колоды из URL
    const {
        cards,
        error,
    } = useSelector<AppRootStateType, CardsStateType>(state => state.cards)
    const packs = useSelector<AppRootStateType, Array<PackDataType>>(state => state.packs.cardPacks)
    const dispatch = useDispatch()
    const [isFirstCard, setIsFirstCard] = useState<boolean>(true);
    const [card, setCard] = useState<CardDataType>({
        _id: '',
        user_id: '',
        cardsPack_id: '',
        answer: '',
        question: '',
        grade: 0,
        shots: 0,
        type: 'card',
        rating: 0,
        comments: '',
        created: new Date(),
        updated: new Date(),
        answerImg: '',
        questionImg: ''
    })

    useEffect(() => {

        if (isFirstCard) {
            dispatch(getCardsTC(packId)); //запрашиваем карточки
            setIsFirstCard(false);
        }
        if (cards.length > 0 && card._id === '') setCard(getRandomCard(cards))
    }, [dispatch, packId, cards, card, isFirstCard])

    useEffect(() => {
        //зачищаем карточки при выходе со страницы Learn, чтобы во время запроса новых карточек в Cards не просвечивались старые
        return () => {
            dispatch(setCardsAC([], "", 1, 0, 10))
        }
    }, [])

    const onGradeBtnClick = (grade: string | undefined) => {
        dispatch(updateGradeTC(grade && +grade || 0, card._id))
        setCard(getRandomCard(cards))
        setShowAnswer(false)
    }
    const onNextClick = () => {
        setCard(getRandomCard(cards))
        setShowAnswer(false)
    }

    //защита от попытки открыть Learn с выдуманным packId в url
    let isPackFound = packs.some(p => p._id === packId)

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>
    if (!isPackFound) return <Redirect to={PATH.PACKS}/>

    return <Modal show enableBackground modalWidthPx={800} modalHeightPx={600}
                  backgroundOnClick={() => history.push(PATH.PACKS)}>
        <div className={error && commonStyle.error}>{error}</div>
        {/*вопрос*/}
        <div className={style.learn}>
            <div className={style.section}>
                <h4>Question: </h4>
                <p className={style.text}>{card.question}</p>
            </div>
            {card.questionImg && <div className={style.questionImg} style={{backgroundImage: `url(${card.questionImg})`}}>
            </div>}
            {!showAnswer && <button className={style.section} onClick={() => setShowAnswer(true)}>Check answer</button>}
            {/*ответ*/}
            {showAnswer && <>
                <div className={style.section}>
                    <h4>Answer: </h4>
                    <p className={style.text}>{card.answer}</p>
                </div>
                {card.answerImg && <div className={style.answerImg} style={{backgroundImage: `url(${card.answerImg})`}}>
                </div>}
                <div className={style.buttons}>
                    <button onClick={e => onGradeBtnClick(e.currentTarget.dataset.grade)} data-grade={'1'}>
                        Не знал/<br/>Didn’t know
                    </button>
                    <button onClick={e => onGradeBtnClick(e.currentTarget.dataset.grade)} data-grade={'2'}>
                        Забыл/<br/>Forgot
                    </button>
                    <button onClick={e => onGradeBtnClick(e.currentTarget.dataset.grade)} data-grade={'3'}>
                        Долго думал/<br/>Thought too long
                    </button>
                    <button onClick={e => onGradeBtnClick(e.currentTarget.dataset.grade)} data-grade={'4'}>
                        Почти угадал/<br/>Nearly guessed
                    </button>
                    <button onClick={e => onGradeBtnClick(e.currentTarget.dataset.grade)} data-grade={'5'}>
                        Знал/<br/>I knew it
                    </button>
                </div>
            </>
            }
            <div className={style.buttons}>
                <NavLink to={PATH.PACKS}> Cancel </NavLink>
                <button onClick={onNextClick}>Next</button>
            </div>
        </div>
    </Modal>
}