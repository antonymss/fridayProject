import React, {useCallback, useState} from "react";
import style from "./Files.module.css";
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {PATH} from "../../app/App";
import {FileUploader, UploadedFileDataType} from "../../common/FileUploader/FileUploader";
import {Button, Progress} from "antd";
import {DeleteTwoTone, UploadOutlined} from "@ant-design/icons";
import {FilesStateType, getFileTC, sendFileTC} from "./files-reducer";
import commonStyle from "../../common/styles/error.module.css";
import {Video} from "./Video";

export const downloadUpdatedFile = (fileName: string, text: string) => {
    const link = document.createElement("a");
    link.href = "data:text/plain;content-disposition=attachment;filename=file," + text;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const Files = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const {error, requestStatus} = useSelector<AppRootStateType, FilesStateType>(state => state.files)
    const [fileData, setFileData] = useState<FormData>()
    const [base64, setBase64] = useState<string>('')
    const [fileURL, setFileURL] = useState<string>('')
    const [fileName, setFileName] = useState<string>('')
    const [fileLastModified, setFileLastModified] = useState<string>('')
    const [fileSize, setFileSize] = useState<string | undefined>('')
    const [fileType, setFileType] = useState<string>('')
    const [newText, setNewText] = useState<string>('')
    const [showDownloadButton, setShowDownloadButton] = useState<boolean>(false)
    const dispatch = useDispatch()

    const onFileUpload = useCallback((fileData: UploadedFileDataType) => {
        setFileName(fileData.fileName)
        setFileSize(fileData.fileSize)
        setFileType(fileData.fileType)
        setFileLastModified(fileData.fileLastModified)
        setFileURL(fileData.fileURL)
        setBase64(fileData.base64)
        setFileData(fileData.formData)
    }, [setFileName, setFileSize, setFileType, setFileURL, setBase64, setFileData])

    const onSendClick = () => {
        fileData && dispatch(sendFileTC(fileData))
        setShowDownloadButton(true)
    }
    const onDownloadClick = () => {
        fileData && dispatch(getFileTC(fileName))
    }

    const onSaveClick = () => {
        let text = base64 + `\r\n` + newText
        downloadUpdatedFile(fileName, text)
    }
    const onDeleteImageClick = () => {
        setFileName('')
        setFileSize('')
        setFileType('')
        setFileLastModified('')
        setFileURL('')
        setBase64('')
        setFileData(undefined)
    }

    if (!isLoggedIn) return <Redirect to={PATH.LOGIN}/>

    return (
        <div className={style.files}>
            {requestStatus === 'loading' && <Progress status="active" percent={99.9} style={{position: "absolute", top: 0}}
                                                      strokeColor={{from: '#1890ff', to: '#76ff7a'}} strokeWidth={7}/>}
            <div className={error && commonStyle.error}>{error}</div>
            <FileUploader onClick={onFileUpload} style={{margin: '20px'}}>
                <Button icon={<UploadOutlined/>}>Upload file</Button>
            </FileUploader>
            {/*данные файла*/}
            {fileName && <p>File Name: {fileName}</p>}
            {fileSize && <p>File Size: {fileSize}</p>}
            {fileLastModified && <p>Last Modified: {fileLastModified}</p>}
            {/*превью картинки*/}
            {/image\/.+/.test(fileType) && fileURL && <div className={style.previewContainer}>
                {/*картинка*/}
                <div className={style.preview} style={{backgroundImage: `url(${fileURL})`}}> </div>
                {/*кнопка для удаления*/}
                <div className={style.bin}>
                    <Button onClick={onDeleteImageClick}
                            icon={<DeleteTwoTone style={{fontSize: '16px'}}/>} shape="circle" ghost/>
                </div>
            </div>}
            {/*превью текста*/}
            {/text\/.+/.test(fileType) && <>
                <b><pre>{base64}</pre></b>
                <textarea value={newText} onChange={e => setNewText(e.currentTarget.value)}/>
                <Button onClick={onSaveClick}>Add text and Download file</Button>
            </>}
            {/*превью видео*/}
            {/video\/.+/.test(fileType) && <>
                <Video fileURL={fileURL}/>
            </>}
            {/*кнопки для отправки картинки на сервер*/}
            {fileData && <>
                <Button onClick={onSendClick}>Send file to server</Button>
            </>}
            {showDownloadButton && <Button onClick={onDownloadClick}>Download my file from server</Button>}

        </div>
    );
}

