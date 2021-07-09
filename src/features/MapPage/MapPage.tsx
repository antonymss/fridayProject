import React, {useState} from "react";
import {
    FullscreenControl,
    GeolocationControl,
    Map,
    Placemark,
    SearchControl,
    YMaps,
    ZoomControl
} from 'react-yandex-maps';
import style from "./MapPage.module.css";
import {config} from "../../config";
import {RouteCalculator} from "./RouteCalculator";


export const MapPage = () => {
    console.log('render TestMapPage')
    const [coordinates, setCoordinates] = useState([55.684758, 37.738521])
    const [destination1, setDestination1] = useState('Moscow, Russia')
    const [destination2, setDestination2] = useState('Minsk, Belarus')


    return (
        <div>
            <YMaps query={{
                apikey: config.MY_API_KEY,
            }}>
                <div className={style.mapPage}>

                    <Map height={370} width={370}
                         state={{center: [55.75, 37.57], zoom: 9}}
                         onClick={(e: any) => {
                             setCoordinates([...e.get('coords')])
                         }}
                    >
                        <Placemark geometry={[coordinates[0], coordinates[1]]} modules={['geoObject.addon.hint']}
                                   properties={{
                                       hintContent: `${coordinates}`,
                                   }}
                        />
                        <ZoomControl options={{ float: 'right' }} />
                        <GeolocationControl options={{ float: 'left' }} />
                        <FullscreenControl />
                        <SearchControl options={{ float: 'right' }} />
                    </Map>

                    <div>
                        {/*пока пробный подсчет расстояния между двумя точками, используя Yandex API через HOC withYMaps:*/}
                        Route calculation:
                        <div>
                            <input placeholder="Enter a destination" value={destination1}
                                   onChange={e => setDestination1(e.currentTarget.value)}/>{' '}
                            <input placeholder="Enter a destination" value={destination2}
                                   onChange={e => setDestination2(e.currentTarget.value)}/>
                        </div>
                        <RouteCalculator route={[destination1, destination2]}/>
                    </div>
                </div>
            </YMaps>
        </div>
    )
}