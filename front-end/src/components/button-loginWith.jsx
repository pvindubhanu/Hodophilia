import { QuestionCircleOutlined } from '@ant-design/icons';
import Styles from './css/button-loginWith.module.css';

// testing a branch
// <a th:href="/@{/oauth2/authorization/google}">Login with Google</a>

/**
 * Props:
 * children: Everything between opening and closing tags
 * icon: the (preferrably svg) image for the service authenticating with 
 * href: a link to authentication with external service
 */
function LoginWith(props) {

    // handles props
    const innerHTML = props.children ? "Continue with " + props.children : "";

    const href = props.href || null;
    const onClick = props.onClick || function() {};
    const icon = props.icon;

    function buttonClick(e) {
        e.preventDefault();
        onClick();
        if (href !== null) window.location.href = href;
    }

    return (
        <div className={Styles.loginButtonWrapper}>
            <button onClick={buttonClick}>
                <table>
                    <tr>
                        <td className={Styles['image']}> { /* Icon image */}
                            {
                                icon ? <img src={icon} alt='Not found' /> : <QuestionCircleOutlined />
                            }
                        </td>
                        <td> { /* Authentication system name */}
                            {innerHTML}
                        </td>
                    </tr>
                </table>
            </button>
        </div>
    )
}

export default LoginWith;