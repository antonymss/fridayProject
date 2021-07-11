import React, {useEffect, useState} from "react";
import {withYMaps} from 'react-yandex-maps';

type PropsType = {
    ymaps?: any
    route: any
}

const LengthCalculator: React.FC<PropsType> = React.memo(({ymaps, route}) => {
        const [routeLength, setRouteLength] = useState(null)

        useEffect(() => {
            let canceled = false

            if (ymaps && ymaps.route) {
                ymaps.route(route).then((route: any) => {
                    if (!canceled) {
                        setRouteLength(route.getHumanLength().replace('&#160;', ' '))
                    }
                })
            }

            return () => {
                canceled = true
            }
        }, [ymaps, ...route])

        return routeLength
            ? <p>
                The route from <b>{route[0]}</b> to <b>{route[1]}</b> is <b>{routeLength}</b> long
            </p>
            : <p>Loading route...</p>
    }
)
//оборачиваем LengthCalculator в HOC withYMaps:
export const RouteCalculator = withYMaps(LengthCalculator, true, ['route'])