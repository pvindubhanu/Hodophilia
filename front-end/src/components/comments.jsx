import {Component, useContext} from "react";
import ItinerarySelect from "./list-itinerarySelect";
import CommentBox from "./commentBox";
import CommentList from "./list_commentLines";
import {shareNewItinerary} from "../services/sharedItinerary";
import {LoginContext} from "../contexts/loginContext";

let commentCounter = 1;

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentValue: "",
            commentLine: [{commentId: "", text: "",}],
        };
    }

    handleCommentValue = (e) => {
        this.setState({
            commentValue: e.target.value,
        });
    };

    setCommentLine = () => {
        this.setState({
            commentLine: [
                ...this.state.commentLine,
                {commentId: commentCounter++, text: this.state.commentValue}],
            commentValue: "",
        });
    }

    submitCommentLine = (e) => {
        e.preventDefault();
        this.setCommentLine();
        // post call
        // const currUser = useContext(LoginContext);
        // let itin = currentuser.getItinerary();
        // if (itineraryId !== null) {
        //     //post to shared table
        //     postItineraryComment(currUser, itineraryId, this.state.commentLine.).then((result) => {
        //         // const fetchAllSharedIItinerary = async () => {
        //         //     let results = await getAllSharedItinerary(currentuser);
        //         //     sharedIndexList = [];
        //         //     results.map(sharedItr => {
        //         //         sharedIndexList.push(sharedItr.itinerary_id);
        //         //     })
        //         // }
        //         // fetchAllSharedIItinerary().catch(console.error);
        //         setSharedIndex(getSharedIndexList);
        //
        //         navigate('/shared');
        //     })
        //         .catch((error) => console.warn("The error from shareItem", error))
        //
        //
        // }
    };
    enterCommentLine = (e) => {
        if (e.charCode === 13) {
            this.setCommentLine();
        }
    };

    render() {
        const { sharedItineraryId } = this.props;
        return (
            <>
                ...
                <CommentBox
                    commentValue={this.state.commentValue}
                    handleCommentValue={this.handleCommentValue}
                    enterCommentLine={this.enterCommentLine}
                    submitCommentLine={this.submitCommentLine}
                    sharedItineraryId={sharedItineraryId}
                />
                <CommentList
                    commentLine={this.state.commentLine}
                />
                ...
            </>
        )
    }
}

export default Comments;