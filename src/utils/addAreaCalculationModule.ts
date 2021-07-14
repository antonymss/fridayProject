import {AnyObject, ObjectManagerFeature, YMapsApi} from "react-yandex-maps";

export const addAreaCalculationModule = (ymaps: YMapsApi) => {

    ymaps.modules.define('util.calculateArea', [] as any, function (provide: any) {
        // Equatorial radius of Earth
        let RADIUS = 6378137

        function calculateArea(feature: ObjectManagerFeature) {
            let geoJsonGeometry = getGeoJsonGeometry(feature)
            return calculateJsonGeometryArea(geoJsonGeometry)
        }

        function getGeoJsonGeometry(feature: ObjectManagerFeature) {
            if (feature.type === 'Feature') {
                return feature.geometry
            } else if (feature.geometry && feature.geometry.getType) {
                if (feature.geometry.getType() === 'Circle') {
                    return {
                        type: 'Circle',
                        coordinates: feature.geometry.getCoordinates(),
                        radius: feature.geometry.getRadius()
                    }
                }
                return {
                    type: feature.geometry.getType(),
                    coordinates: feature.geometry.getCoordinates()
                }
            } else {
                throw new Error('util.calculateArea: Unknown input object.')
            }
        }

        function calculateJsonGeometryArea(geometry: AnyObject) {
            let area = 0
            let i
            switch (geometry.type) {
                case 'Polygon':
                    return polygonArea(geometry.coordinates)
                case 'MultiPolygon':
                    for (i = 0; i < geometry.coordinates.length; i++) {
                        area += polygonArea(geometry.coordinates[i])
                    }
                    return area
                case 'Rectangle':
                    return polygonArea([[
                        geometry.coordinates[0],
                        [geometry.coordinates[0][0], geometry.coordinates[1][1]],
                        geometry.coordinates[1],
                        [geometry.coordinates[1][0], geometry.coordinates[0][1]],
                        geometry.coordinates[0]
                    ]]);
                case 'Circle':
                    return Math.PI * Math.pow(geometry.radius, 2)
                case 'Point':
                case 'MultiPoint':
                case 'LineString':
                case 'MultiLineString':
                    return 0
            }
        }

        function polygonArea(coords: number[][][]) {
            let area = 0
            if (coords && coords.length > 0) {
                area += Math.abs(ringArea(coords[0]))
                for (let i = 1; i < coords.length; i++) {
                    area -= Math.abs(ringArea(coords[i]))
                }
            }
            return area
        }

        /**
         * Modified version of https://github.com/mapbox/geojson-area
         * Calculate the approximate area of the polygon were it projected onto
         *     the earth.  Note that this area will be positive if ring is oriented
         *     clockwise, otherwise it will be negative.
         *
         * Reference:
         * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
         *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
         *     Laboratory, Pasadena, CA, June 2007 https://trs.jpl.nasa.gov/handle/2014/40409
         *
         * Returns:
         * {Number} The approximate signed geodesic area of the polygon in square
         *     meters.
         */

        function ringArea(coords: number[][]) {
            let p1 = []
            let p2 = []
            let p3 = []
            let lowerIndex
            let middleIndex
            let upperIndex
            let i
            let area = 0
            let coordsLength = coords.length
            let longitude = ymaps.meta.coordinatesOrder === 'latlong' ? 1 : 0
            let latitude = ymaps.meta.coordinatesOrder === 'latlong' ? 0 : 1

            if (coordsLength > 2) {
                for (i = 0; i < coordsLength; i++) {
                    // i = N-2
                    if (i === coordsLength - 2) {
                        lowerIndex = coordsLength - 2
                        middleIndex = coordsLength - 1
                        upperIndex = 0
                    } else if (i === coordsLength - 1) {
                        // i = N-1
                        lowerIndex = coordsLength - 1
                        middleIndex = 0
                        upperIndex = 1
                    } else {
                        // i = 0 to N-3
                        lowerIndex = i
                        middleIndex = i + 1
                        upperIndex = i + 2
                    }
                    p1 = coords[lowerIndex]
                    p2 = coords[middleIndex]
                    p3 = coords[upperIndex]
                    area += (rad(p3[longitude]) - rad(p1[longitude])) * Math.sin(rad(p2[latitude]))
                }

                area = area * RADIUS * RADIUS / 2
            }

            return area
        }

        function rad(_: number) {
            return _ * Math.PI / 180
        }

        provide(calculateArea)
    } as ElementDefinitionOptions | undefined)
}
