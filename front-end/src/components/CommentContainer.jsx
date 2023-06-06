import React, {useContext, useEffect, useState} from "react";
import {getSharedItineraryComments} from "../services/comments";
import {getAllSharedItinerary} from "../services/sharedItinerary";
import {LoginContext} from "../contexts/loginContext";


function CommentContainer(itrId) {
    const [comments, setComments] = useState();
    const currentuser = useContext(LoginContext);

    useEffect(() => {
        const getCommentsForItr = async (itrId) => {
            console.log(itrId);
            let commentsList = await getSharedItineraryComments(currentuser, itrId.itrId);

            console.log(commentsList);
            setComments(commentsList);

        }
        getCommentsForItr(itrId).catch(console.error);

    }, [])

    console.log("commmmmennnnttssss:"+ comments);


    return (
        <div>
            {comments? comments.map((comment) => (
                //{isSharedItrComment(testimonial.itinerary_id, comment.itineraryId)?
                <div className="d-flex mb-3">
                    <div>
                        <div className="bg-light rounded-3 px-3 py-1">
                            <a href="#" className="text-dark mb-0">
                                <strong>{comment.userEmail}</strong>
                            </a>
                            <a href="#" className="text-muted d-block">
                                <small>
                                    {comment.commentText}
                                </small>
                            </a>
                        </div>
                    </div>
                </div>
            )): null}
        </div>


    );
}

export default CommentContainer;