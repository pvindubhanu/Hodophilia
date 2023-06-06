import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import PageWrapper from './wrappers/wrapper-regularPage';
import SearchForm from '../form-search.jsx';

export default function Search(props) {

    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <PageWrapper>
            <h1>This is the search page.</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <SearchForm showCount={10}>{searchParams.getAll('search')}</SearchForm>
            </div>
        </PageWrapper>
    )
}