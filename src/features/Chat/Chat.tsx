import React, {useCallback, useEffect, useRef, useState, KeyboardEvent} from "react";
import style from "./Chat.module.css";
import {socket} from "../../api/social-api";
import {Typography} from "antd";

type MessagesType = {
    _id: string
    message: string
    user: {
        _id: string
        name: string
    }
}

export const Chat = () => {
    const {Paragraph} = Typography;
    const messagesRef = useRef<HTMLDivElement | null>(null)
    const [messages, setMessages] = useState<Array<MessagesType> | undefined>()
    const [newMessageText, setNewMessageText] = useState<string>('')
    const [myName, setMyName] = useState<string>('anonymous')

    useEffect(() => {
        socket.emit("init", (answer: string) => console.log(answer));
        socket.on('init-messages-published', (initMessages: Array<MessagesType>) => {
            setMessages([...initMessages])
        })
    }, [])

    useEffect(() => {
        socket.on('new-message-sent', (message: MessagesType) => {
            messages ? setMessages([...messages, message]) : setMessages([message])
        })
        if (messagesRef && messagesRef.current) {
            messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight)
        }
    }, [messages, messagesRef])

    const onEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') onSendClick()
    }

    const onSendClick = () => {
        socket.emit("client-message-sent", newMessageText, (answer: string) => console.log(answer))
        setNewMessageText('')
    }

    const onNewNameSubmit = useCallback((newName: string) => {
        socket.emit("client-name-sent", newName, (answer: string) => console.log(answer))
        setMyName(newName)
    }, [setMyName])

    return (
        <div className={style.chat}>
            <div>
                My name in this chat:
                <b><Paragraph editable={{onChange: onNewNameSubmit}} style={{color: '#1890ff'}}>
                    {myName}</Paragraph></b>
            </div>
            <div className={style.messages} ref={messagesRef}>
                {messages && messages.map(m => <div key={m._id}>
                    <b>{m.user.name}</b>: {m.message}
                </div>)}
            </div>
            <div className={style.input}>
                <textarea onChange={e => setNewMessageText(e.currentTarget.value)} value={newMessageText}
                          placeholder={'Enter your message'} onKeyPress={e => onEnter(e)}> </textarea>
                <button onClick={onSendClick}>Send</button>
            </div>
        </div>
    );
}

