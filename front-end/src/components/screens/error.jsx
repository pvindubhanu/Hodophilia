import PageWrapper from "./wrappers/wrapper-regularPage"

export default function Error() {
    return (
        <PageWrapper>
            <h1 style={{ color: "red" }}>Error 404: page not found.</h1>
        </PageWrapper>
    )
}