import React, {useEffect, useRef, useState} from "react";
import style from "./Files.module.css";
import muteIcon from "../../assets/images/mute.svg";
import {
    CaretRightOutlined,
    DashboardOutlined,
    FullscreenOutlined,
    PauseOutlined,
    PlaySquareOutlined,
    SoundOutlined
} from '@ant-design/icons';
import {Button, Popover, Radio, RadioChangeEvent, Slider, Space} from "antd";

//преобразуем время видео в формат 00:00:
const formatTime = (seconds: number | undefined) => {
    if (seconds) {
        let minutes = Math.floor(seconds / 60);
        let minutesString = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        let secondsString = (seconds >= 10) ? seconds : "0" + seconds;
        return minutesString + ":" + secondsString;
    } else return '00:00'
}

type VideoPropsType = {
    fileURL: string
}
export const Video: React.FC<VideoPropsType> = React.memo(({fileURL}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [duration, setDuration] = useState<number | undefined>()
    const [currentTime, setCurrentTime] = useState<number | undefined>()
    const [volume, setVolume] = useState<number | undefined>()
    const [isPaused, setIsPaused] = useState<boolean>(true)
    const [showSpeedRates, setShowSpeedRates] = useState<boolean>(false)
    const formattedDuration = formatTime(duration)
    const formattedCurrentTime = formatTime(currentTime)

    useEffect(() => {
        // сетаем данные видео каждые 300мс:
        const intervalId = setInterval(() => {
            videoRef.current && setDuration(videoRef.current && videoRef.current.duration)
            if (videoRef.current && videoRef.current.currentTime === videoRef.current.duration) {
                videoRef.current.currentTime = 0
                videoRef.current.play()
            }
            videoRef.current && setCurrentTime(videoRef.current && videoRef.current.currentTime)
            videoRef.current && setVolume(videoRef.current && videoRef.current.volume)
        }, 300)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    const play = () => videoRef.current && videoRef.current.play()
    const pause = () => videoRef.current && videoRef.current.pause()
    const onCurrentTimeChange = (value: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value
        }
    }
    const onVolumeChange = (value: number) => {
        if (videoRef.current) {
            videoRef.current.volume = value
        }
    }
    const onSpeedChange = (e: RadioChangeEvent) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = e.target.value
        }
        setShowSpeedRates(false)
    }
    // слайдер-контроллер громкости:
    const volumeRate = (
        <Slider style={{height: '60px', margin: '0', padding: '0'}} vertical
                value={volume} min={0} max={1} onChange={onVolumeChange} step={0.1}/>
    )
    // кнопки для выбора скорости воспроизведения:
    const playbackSpeed = (
        <Radio.Group defaultValue={1.0} size="small" onChange={onSpeedChange}>
            <Space direction="vertical">
                <Radio.Button style={{padding: '0', margin: '0'}} value={0.25}>0.25x</Radio.Button>
                <Radio.Button style={{padding: '0', margin: '0'}} value={0.5}>0.5x</Radio.Button>
                <Radio.Button style={{padding: '0', margin: '0'}} value={0.75}>0.75x</Radio.Button>
                <Radio.Button style={{padding: '0', margin: '0'}} value={1.0}>Normal</Radio.Button>
                <Radio.Button style={{padding: '0', margin: '0'}} value={1.25}>1.25x</Radio.Button>
                <Radio.Button style={{padding: '0', margin: '0'}} value={1.5}>1.5x</Radio.Button>
                <Radio.Button style={{padding: '0', margin: '0'}} value={1.75}>1.75x</Radio.Button>
                <Radio.Button style={{padding: '0', margin: '0'}} value={2}>2x</Radio.Button>
            </Space>
        </Radio.Group>
    )

    return <div className={style.video}>
        <video src={fileURL} ref={videoRef}/>
        {/*дивка с кнопками*/}
        <div className={style.videoControls}>
            {/*большая кнопка play*/}
            <div className={style.playBtn} onClick={() => {
                isPaused ? play() : pause()
                setIsPaused(!isPaused)
            }}>
                {isPaused
                    ? <PlaySquareOutlined style={{color: '#1890ff', fontSize: '60px'}}/>
                    : null}
            </div>
            <div className={style.controlBtns}>
                {/*маленькая кнопка play/pause*/}
                <div className={style.playAndTime}>
                    {isPaused
                        ? <Button onClick={() => {
                            play()
                            setIsPaused(false)
                        }} icon={<CaretRightOutlined style={{color: '#1890ff', fontSize: '25px'}}/>}
                                  type={'link'} ghost/>
                        : <Button onClick={() => {
                            pause()
                            setIsPaused(true)
                        }} icon={<PauseOutlined style={{color: '#1890ff', fontSize: '25px'}}/>}
                                  type={'link'} ghost/>}
                    {/*время*/}
                    <span>{formattedCurrentTime}/{formattedDuration}</span>
                </div>
                {/*слайдер для перемотки*/}
                <Slider style={{width: '500px'}} tooltipVisible={false}
                        value={currentTime} min={0} max={duration} step={0.01}
                        onChange={onCurrentTimeChange}
                />
                <div className={style.settings}>
                    {/*звук*/}
                    <Popover content={volumeRate} overlayStyle={{width: '35px'}} overlayInnerStyle={{opacity: '0.9'}}>
                        {volume && volume > 0
                            ? <Button onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.volume = 0
                                }
                            }} icon={<SoundOutlined style={{color: '#1890ff', fontSize: '20px'}}/>}
                                      type={'link'} ghost/>
                            : <Button onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.volume = 0.5
                                }
                            }} icon={<img src={muteIcon} alt={'mute'}/>}
                                      type={'link'} ghost/>}
                    </Popover>
                    {/*скорость воспроизведения*/}
                    <Popover content={playbackSpeed} overlayStyle={{width: '64px'}} overlayInnerStyle={{opacity: '0.9'}}
                             trigger="click" visible={showSpeedRates} onVisibleChange={(visible) => {
                        setShowSpeedRates(visible)
                    }}>
                        <DashboardOutlined style={{color: '#1890ff', fontSize: '20px'}}/>
                    </Popover>
                    {/*полноэкранный режим*/}
                    <Button onClick={() => {
                        if (videoRef.current) {
                            videoRef.current.requestFullscreen()
                        }
                    }} icon={<FullscreenOutlined style={{color: '#1890ff', fontSize: '20px'}}/>}
                            type={'link'} ghost/>
                </div>
            </div>

        </div>
    </div>
})