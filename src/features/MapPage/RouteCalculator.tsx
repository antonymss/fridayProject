import React, {useEffect, useState} from "react";
import {withYMaps, YMapsApi} from 'react-yandex-maps';
import commonStyle from "../../common/styles/error.module.css";

type PropsType = {
    ymaps?: YMapsApi
    route: Array<string>
}

const LengthCalculator: React.FC<PropsType> = React.memo(({ymaps, route}) => {
        const [routeLength, setRouteLength] = useState(null)
        const [error, setError] = useState('')

        useEffect(() => {
            let canceled = false

            if (ymaps && ymaps.route) {
                ymaps.route(route).then((route: any) => {
                    if (!canceled) {
                        setRouteLength(route.getHumanLength().replace('&#160;', ' '))
                    }
                }).catch((error: { message: string }) => {
                    if (error.message === 'scriptError') {
                        setError('Please enter valid destination names or coordinates.')
                        setTimeout(() => {
                            setError('')
                        }, 3000)
                    }
                })
            }

            return () => {
                canceled = true
            }
        }, [ymaps, ...route])

        return <>
            {
                routeLength
                    ? <p>
                        The route from <b>{route[0]}</b> to <b>{route[1]}</b> is <b>{routeLength}</b> long
                    </p>
                    : <p>Loading route...</p>
            }
            {error && <div className={error && commonStyle.error}>{error}</div>}
        </>
    }
)
//оборачиваем LengthCalculator в HOC withYMaps:
export const RouteCalculator = withYMaps(LengthCalculator, true, ['route'])