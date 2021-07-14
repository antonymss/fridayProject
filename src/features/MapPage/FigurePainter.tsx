import React, {useCallback, useEffect, useState} from "react";
import {AnyObject, Placemark, Polygon, withYMaps, YMapsApi} from 'react-yandex-maps';
import {addAreaCalculationModule} from "../../utils/addAreaCalculationModule";

type PropsType = {
    ymaps?: YMapsApi
    stopDrawing: boolean
}

const Painter: React.FC<PropsType> = React.memo(({ymaps, stopDrawing}) => {
        const [coordinates, setCoordinates] = useState<number[][]>([])
        const [area, setArea] = useState<string>('')
        const [polygonCenter, setPolygonCenter] = useState<number[]>([])
        const [calcModuleLoaded, setCalcModuleLoaded] = useState<boolean>(false)

        useEffect(() => {
            if (ymaps && !stopDrawing) {
                addAreaCalculationModule(ymaps)
                ymaps.ready(['util.calculateArea']).then(() => {
                    setCalcModuleLoaded(true)
                }).catch((error: string) => console.log(error))
            }
        }, [])

        const onVertexChange = useCallback((ref: AnyObject) => {
            let coords = ref.geometry.getCoordinates()[0]
            setCoordinates(coords.slice(0, -1))
            if (calcModuleLoaded) {
                // вычисляем и сетаем центр полигона для установления метки в него:
                setPolygonCenter(ymaps?.util.bounds.getCenter(ref.geometry.getBounds()))
                // вычисляем и сетаем площадь полигона:
                let newArea = Math.round(ymaps?.util.calculateArea(ref))
                if (newArea <= 1e6) setArea(`${newArea} m²`)
                else setArea(`${(newArea / 1e6).toFixed(3)} km²`)
            }
        }, [ymaps, calcModuleLoaded])

        const draw = useCallback((ref: AnyObject) => {
            if (!stopDrawing) {
                ref.editor.startDrawing()
                ref.editor.events.add("vertexadd", () => { // при добавлении вершины вызываем функцию перерасчёта
                    onVertexChange(ref)
                })
                ref.editor.events.add("vertexdragend", () => { // при перетаскивании вершины вызываем функцию перерасчёта
                    onVertexChange(ref)
                })
            } else {
                coordinates.length > 0 && ref.editor.stopDrawing()
            }
        }, [onVertexChange, stopDrawing, coordinates])

        return <div>
            <Polygon
                modules={["geoObject.addon.editor", "geoObject.addon.hint"]}
                instanceRef={(ref: AnyObject) => ref && draw(ref)}
                geometry={[coordinates]}
                options={{
                    editorDrawingCursor: "crosshair",
                    fillColor: '#ff0000',
                    strokeColor: '#ff0000',
                    strokeOpacity: 0.6,
                    strokeWidth: 6,
                    fillOpacity: 0.3,
                }}
                properties={{
                    hintContent: `${area}`,
                }}
            />
            <Placemark geometry={polygonCenter}
                       properties={{
                           iconCaption: `${area}`,
                       }}
                       options={{
                           preset: 'islands#greenDotIconWithCaption'
                       }}
            />
        </div>
    }
)

//оборачиваем LengthCalculator в HOC withYMaps:
export const FigurePainter = withYMaps(Painter, true, ['meta', 'util.bounds'])