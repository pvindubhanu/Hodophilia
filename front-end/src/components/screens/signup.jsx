import PageWrapper from './wrappers/wrapper-formPage.jsx';
import InputForm from '../form-loginSignup.jsx';

export default function Signup() {
    return (
        <PageWrapper>
            <h1>Signup</h1>
            <InputForm isSignup={true} />
        </PageWrapper>
    )
}