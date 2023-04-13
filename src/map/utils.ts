import * as countries from 'i18n-iso-countries' 

function buildOutputObject(iso3: string) {
    let iso2 = countries.alpha3ToAlpha2(iso3)
    let numeric = countries.alpha3ToNumeric(iso3)

    let name_container = new Intl.DisplayNames(['en'], {type: 'region'})
    let name = name_container.of(iso2)

    const outObject = {
        iso2,
        iso3,
        numeric,
        name: name
    }

    return outObject
}

export { buildOutputObject }