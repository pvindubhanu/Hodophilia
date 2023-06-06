import ItinerarySelect from "./list-itinerarySelect";
import {Component, useContext} from "react";
import Styles from "./css/list-itinerarySelect.module.css";
import {LoginContext} from "../contexts/loginContext";
import {postItineraryComment} from "../services/comments";

class CommentBox extends Component {
    render() {
        const { commentValue, handleCommentValue,
            enterCommentLine, submitCommentLine, sharedItineraryId} = this.props;

        const enableCommentButton = () => {
            return (commentValue ? false : true);
        }
        const changeCommentButtonStyle = () => {
            return (commentValue ? "comments-button-enabled" :
                "comments-button-disabled");
        }
        const postCommentLine = () => {
            // console.log("sharedItrineraryIndex:" + sharedItrineraryIndex+",");
            // if (sharedItrineraryIndex !== null) {
            //     //post to shared table
            //     postItineraryComment(sharedItrineraryIndex, commentValue).then((result) => {
            //
            //     })
            //         .catch((error) => console.warn("The error from shareItem", error))
            //
            //
            // }
        }

        return (
            //<div className={`${Styles['itinerarySection']} ${Styles['itineraryDetails']}`}>
            <div className="comments-box">
                <input onInput={enterCommentLine} value={commentValue}
                       id="comments-input" onChange={handleCommentValue}
                       type="text" placeholder="Add a comment..." />
                <button onClickCapture={postCommentLine} onClick={submitCommentLine} type="submit"
                        className="comments-button"id={changeCommentButtonStyle()}
                        disabled={enableCommentButton()}>Post</button>
            </div>
        )}
}

export default CommentBox;