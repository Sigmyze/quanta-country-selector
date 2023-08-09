import { SelectorWrapper } from "quanta-selector-framework"
import React from "react"
import { render } from "react-dom"
import MapContainer from "./map/map"

const App: React.FC = ({ }) => {
    return (
        <>
            <SelectorWrapper>
                <MapContainer />
            </SelectorWrapper>
        </>
    )
}

//MANDATORY in order for the selector to work
render(<App />, document.getElementById("app"))