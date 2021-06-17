import React, {ChangeEvent, CSSProperties, useRef} from "react";
import {Button} from "antd";

const getLastModifiedDate = (epochDate: number) => {
    let date = new Date(epochDate);
    return date.toLocaleString()
}

const getFileSize = (size: number) => {
    if (size < 1024) {
        return size + ' bytes'
    } else if (size > 1024 && size < 1048576) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size > 1048576) {
        return (size / 1048576).toFixed(2) + 'MB'
    }
}

export type UploadedFileDataType = {
    //base64 содержит base64 файла либо текст файла, если файл текстовый (получаем из reader.result)
    base64: string
    fileURL: string
    fileName: string
    fileType: string
    fileSize?: string
    fileLastModified: string
    formData: FormData
}

type FileUploaderPropsType = {
    style?: CSSProperties
    onClick: (fileData: UploadedFileDataType) => void
    expectedFileType?: "image" | "video" | "audio" | "text"
}

export const FileUploader: React.FC<FileUploaderPropsType> = React.memo(({
                                                                             style,
                                                                             onClick,
                                                                             expectedFileType,
                                                                             children
                                                                         }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    //при каждой отрисовке зачищаем value inputa, чтобы onChange вызывался, даже если выбираем тот же файл снова
    if (inputRef.current) inputRef.current.value = ''

    const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        const formData = new FormData()
        if (e.target.files !== null && e.target.files[0] instanceof Blob) {
            // получаем base64 файла, необходимый для его отправки на сервер:
            if (!/text\/.+/.test(e.target.files[0].type)) reader.readAsDataURL(e.target.files[0])
            // получаем текст файла, необходимый для отображения, если файл текстовый:
            if (/text\/.+/.test(e.target.files[0].type)) reader.readAsText(e.target.files[0])
            // получаем url файла, необходимый для его предпросмотра до отправки на сервер:
            const imageURL = window.URL.createObjectURL(e.target.files[0])
            // получаем весь файл для отправки на второй сервер для файлов:
            formData.append('myFile', e.target.files[0], e.target.files[0].name)
            reader.onloadend = () => {
                const newBase64 = reader.result
                if (e.target.files && e.target.files[0].size < 2097152) {
                    if (newBase64) onClick({
                        base64: newBase64.toString(),
                        fileURL: imageURL,
                        fileName: e.target.files[0].name,
                        fileType: e.target.files[0].type,
                        fileSize: getFileSize(e.target.files[0].size),
                        fileLastModified: getLastModifiedDate(e.target.files[0].lastModified),
                        formData: formData
                    })
                } else if (e.target.files && e.target.files[0].size > 2097152) {
                    alert('File size should be less than 2MB.')
                }
            }
        } else return
    }
//в зависимости от expectedFileType в пропсах, выбираем, какой формат файлов подсказывать юзеру для выгрузки
    const acceptOptions = expectedFileType === 'image'
        ? 'image/*'
        : expectedFileType === 'video'
            ? 'video/*'
            : expectedFileType === 'text'
                ? '.txt, .doc, .docx, application/msword'
                : expectedFileType === 'audio'
                    ? 'audio/*'
                    : ''

    return <span style={{...style}}>
        <input type="file" multiple={false} accept={acceptOptions} ref={inputRef} style={{display: 'none'}}
               onChange={uploadFile}/>
        <Button onClick={() => {inputRef && inputRef.current && inputRef.current.click()}} type={'link'}>
            {/*внешний вид кнопки будет любым в зависимости от переданного childrena*/}
            {children}
        </Button>
    </span>
})
