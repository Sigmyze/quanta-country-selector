import React, { useEffect } from 'react'
import { IFeatureShape } from './map'
import { buildOutputObject } from './utils'
import { useSetSelected } from 'quanta-selector-react'

interface IMapCountryProps {
    path: string | null,
    feature: IFeatureShape,
    activeId: string,
    setActiveId: React.Dispatch<React.SetStateAction<string>>
}

const MapCountry: React.FC<IMapCountryProps> = ({ path, feature, activeId, setActiveId }) => {
    const setSelected = useSetSelected()
    
    const countryClick = () => {
        setActiveId(feature.id)
        if(feature.id === activeId)
            setActiveId("")
    }

    useEffect(() => {
        if(activeId === "")
            return
        if(activeId !== feature.id)
            return

        let iso3 = feature.id
        let outut = buildOutputObject(iso3)
        //pings with the id initialized in map.tsx
        setSelected("country_selector_quanta", outut)
    }, [activeId])
    
    return (
        <path
            d={path || ''}
            className={`map__country ${feature.id === activeId && 'active'}`}
            onClick={countryClick}
        />
    )
}

export default MapCountry