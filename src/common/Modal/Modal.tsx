import React, {CSSProperties} from "react";

type ModalPropsType = {
    enableBackground?: boolean;
    backgroundOnClick?: () => void;
    modalWidthPx: number;
    modalHeightPx: number;
    modalStyle?: CSSProperties;
    modalOnClick?: () => void;
    show: boolean
}

export const Modal: React.FC<ModalPropsType> = React.memo((
    {
        enableBackground,
        backgroundOnClick = () => {},
        modalWidthPx,
        modalHeightPx,
        modalStyle,
        modalOnClick = () => {},
        show,
        children,
    }
) => {
    const top = `calc(50vh - ${modalHeightPx / 2}px)`
    const left = `calc(50vw - ${modalWidthPx / 2}px)`

    if (!show) return null;

    return (
        <>
            {enableBackground && <div
                style={{
                    position: 'fixed',
                    top: '0px',
                    left: '0px',
                    width: '100vw',
                    height: '100vh',
                    background: 'black',
                    opacity: 0.6,
                    zIndex: 20,
                }}
                onClick={backgroundOnClick}
            />}
            <div
                style={{
                    position: 'fixed',
                    top,
                    left,
                    width: modalWidthPx,
                    height: modalHeightPx,
                    minWidth: 'fit-content',
                    minHeight: 'fit-content',
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fafafa',
                    borderRadius: '2px',
                    zIndex: 21,
                    ...modalStyle,
                }}
                onClick={modalOnClick}
            >
                {children}
            </div>
        </>
    )
})