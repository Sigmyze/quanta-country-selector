import React, { useEffect, useState } from "react"
import world_topo from './world-topo.json'
import { Graticule, Mercator } from "@visx/geo";
import * as topojson from 'topojson-client'
import './map.scss'
import { Zoom, applyMatrixToPoint } from "@visx/zoom"
import { RectClipPath } from '@visx/clip-path'
import { TransformMatrix } from "@visx/zoom/lib/types";
import MapCountry from "./map-country";
import { ISchemaItem, usePingMessage, useSetSchema, useSetSelected } from "quanta-selector-framework";
import { buildOutputObject } from "./utils";

const background = "#101113"

interface IFeatureShape {
    type: 'Feature',
    id: string,
    geometry: { coordinates: [number, number][][]; type: 'Polygon' },
    properties: { name: string }
}

const world = topojson.feature(world_topo as any, world_topo.objects.units as any) as unknown as {
    type: 'FeatureCollection';
    features: IFeatureShape[]
}

const initalTransform = {
    scaleX: 1.25,
    scaleY: 1.25,
    translateY: 0,
    translateX: 0,
    skewX: 0,
    skewY: 0
}

const MapContainer: React.FC = ({ }) => {
    const [dims, setDims] = useState({ x: 1093, y: 650 })
    const [activeId, setActiveId] = useState("")

    const pingMessage = usePingMessage()
    const setSchema = useSetSchema()
    const setSelected = useSetSelected()

    useEffect(() => {
        //this is required for communicating with sandbox
        pingMessage("root")

        let schema = [
            {
                name: "iso2",
                type: "string"
            },
            {
                name: "iso3",
                type: "string"
            },
            {
                name: "name",
                type: "string"
            },
            {
                name: "numeric",
                type: "string"
            }
        ] as ISchemaItem[]
        setSchema("country_selector_quanta_schema", schema) // required to validate that the code works

        //build a default value
        let defaultOutput = buildOutputObject("USA")
        setSelected("country_selector_quanta", defaultOutput)
    }, [])

    //mercator constants
    const centerX = dims.x / 2
    const centerY = dims.y / 2
    const scale = ( dims.x / 630 ) * 100

    const constrain = (transformMatrix: TransformMatrix, prevMatrix: TransformMatrix) => {
        const min = applyMatrixToPoint(transformMatrix, { x: 0, y: 0 })
        const max = applyMatrixToPoint(transformMatrix, { x: dims.x, y: dims.y })

        if(max.x < dims.x || max.y < dims.y)
            return prevMatrix
        if(min.x > 0 || min.y > 0)
            return prevMatrix

        return transformMatrix
    }
    
    return (
        <Zoom<SVGSVGElement>
            width={dims.x}
            height={dims.y}
            scaleXMin={1}
            scaleXMax={3}
            scaleYMin={1}
            scaleYMax={3}
            initialTransformMatrix={initalTransform}
            constrain={constrain}
        >
            {(zoom) => (
                <div className="relative">
                    <svg 
                        width={dims.x} 
                        height={dims.y}
                        ref={zoom.containerRef}
                        style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                    >
                        <RectClipPath 
                            id={"zoom-clip"} 
                            width={dims.x}
                            height={dims.y}
                        />

                        <rect
                            width={dims.x}
                            height={dims.y}
                            x={0}
                            y={0}
                            fill={background}
                            rx={14}
                        />

                        <rect
                            width={dims.x}
                            height={dims.y}
                            fill="transparent"
                            pointerEvents={"all"}
                            onTouchStart={zoom.dragStart}
                            onTouchMove={zoom.dragMove}
                            onTouchEnd={zoom.dragEnd}
                            onMouseDown={zoom.dragStart}
                            onMouseMove={zoom.dragMove}
                            onMouseUp={zoom.dragEnd}
                            onMouseLeave={() => {
                                if (zoom.isDragging) zoom.dragEnd();
                            }}
                        />

                        <g transform={zoom.toString()}>
                            <Mercator<IFeatureShape>
                                data={world.features}
                                scale={scale}
                                translate={[ centerX, centerY ]}
                            >
                                {(mercator) => (
                                    <g>
                                        <Graticule
                                            graticule={(g) => mercator.path(g) || ''}
                                            stroke="rgba(33,33,33,0.05)"
                                        />

                                        {mercator.features.map(({ feature, path }, i) => (
                                            <MapCountry 
                                                key={`map-feature-${i}`}
                                                path={path}
                                                feature={feature}
                                                activeId={activeId}
                                                setActiveId={setActiveId}
                                                
                                            />
                                        ))}
                                    </g>
                                )}
                            </Mercator>
                        </g>
                    </svg>
                </div>
            )}
        </Zoom>
    )
}

export type { IFeatureShape }
export default MapContainer