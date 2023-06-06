import {Component, useContext} from "react";
import Styles from "./css/list-itinerarySelect.module.css";
import {getAllSharedItinerary} from "../services/sharedItinerary";
import {getSharedItineraryComments} from "../services/comments";
import {LoginContext} from "../contexts/loginContext";

class CommentList extends Component {
    commentLine;
    render() {
    //const currentuser = LoginContext;
    const { commentLine } = this.props;
    // getSharedItineraryComments(currentuser, sharedItrineraryIndex).then((result) => {
    //     result.map(sharedItr => {
    //         this.commentLine.push(sharedItr.itinerary_id);
    //     })
    //     //console.log(sharedItineraryIndex);
    //
    // })
    //     .catch((error) => console.warn("The error from getSharedIndexList", error))
    //console.log("shared List:"+ sharedItineraryIndex);
    return (
        //<ul className="comments-list">
        <ul className={`${Styles['itinerarySection']} ${Styles['itinerarySelect']}`}>
    {commentLine.map((val) => {
        return <li className="each-comment" key={val.commentId}>{val.text}</li>
    })
    }
</ul>
)};
}

export default CommentList;