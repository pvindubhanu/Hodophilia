import React from "react"
import SearchForm from "../form-search"
import {ordinal_suffix_of} from '../../constants/utilities'

function Stage01(props) { // before selected to location
    return (
        <>
            <SearchForm
                placeholderSupplement={`Select ${ordinal_suffix_of(props.id)} location`}
                selectItemAction={props.getToLocation}
                clearSearch={true}
            ></SearchForm>
        </>
    )
} 

export default Stage01;