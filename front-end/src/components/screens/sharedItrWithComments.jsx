import React, {useContext, useEffect, useRef, useState} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBContainer, MDBRipple, MDBTextArea,} from "mdb-react-ui-kit";
import Styles from "../css/navbar.module.css";
import PageWrapper from "./wrappers/wrapper-formPage";
import ironManImage from "../../assets/icons/ironman.jpeg";

import {useNavigate} from 'react-router-dom';
import {LoginContext} from "../../contexts/loginContext";
import {deleteSharedItinerary, getAllSharedItinerary} from "../../services/sharedItinerary";
import {deleteSharedItineraryComments, getSharedItineraryComments, postItineraryComment} from "../../services/comments";
import CommentContainer from "../CommentContainer";
import DeleteItem from "../button-liDelete";

import SharedItrModuleCss from '../css/sharedItrPage.module.css';

import {DeleteOutlined} from "@ant-design/icons";
import sharedItrWrapper from "./wrappers/wrapper-sharedItineraryPage";

export default function SharedItrWithComments() {
    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();
    // const fetchAllSharedIItinerary = async () => {
    //     testimonials = await getAllSharedItinerary(currentuser);
    // }
    // fetchAllSharedIItinerary().catch(console.error);
    const [sharedItineraryIndex, setSharedIndex ] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    //const [comments, setComments] = useState();
    //const [commentsText, setcommentsText] = useState();
    const [postingStatus, setPostingStatus] = useState(false);
    const [deletingStatus, setDeletingStatus] = useState(false);
    const commentInputRef = useRef(null);

    useEffect(() => {
        // let itrComments = [];
        // const updateCommentsForItr = async (itrId) => {
        //     itrComments = [];
        //     let commentsList = await getSharedItineraryComments(currentuser, itrId);
        //     commentsList.map(eachComment => {
        //         console.log("looping through itr comments");
        //         itrComments.push(eachComment);
        //     });
        //     console.log(itrComments);
        //     return Promise.resolve(itrComments);
        // }
        const fetchAllSharedIItineraryAndSetComments = async () => {
            let sharedItrIdxList = [];
            let result = await getAllSharedItinerary(currentuser);
            setTestimonials(result);
            result.map(sharedItr => {
                sharedItrIdxList.push(sharedItr.itinerary_id);
            });
             console.log(sharedItrIdxList);
             setSharedIndex(sharedItrIdxList);
            // sharedItrIdxList.forEach(itrId => {
            //     console.log("looping through itr index");
            //     updateCommentsForItr(itrId).then(commentList => {
            //         console.log(commentList);
            //         let commentsObj = comments;
            //         if (commentsObj) {
            //             commentsObj[itrId] = commentList;
            //         }
            //         setComments(commentsObj);
            //     }).catch(console.error);
            //
            //
            // });

            //get comments list for shared itinerary
            // result.map(async sharedItr => {
            //     let commentRes = await getSharedItineraryComments(currentuser,sharedItr.itinerary_id);
            //     comments.push(commentRes);
            //     console.log("Printing Itinerary id in useeffect:"+ sharedItr.itinerary_id);
            //     console.log("Printing comments in useeffect:"+ commentRes);
            // })

        }
        fetchAllSharedIItineraryAndSetComments().catch(console.error);


    }, [])



    // async function getCommentList (ItineraryId) {
    //     console.log("getting shared itr comments");
    //     return await getSharedItineraryComments(currentuser, ItineraryId);
    //     // return await getSharedItineraryComments(currentuser, ItineraryId);
    //     //     .then((result) => {
    //     //     setComments(result);
    //     // }).catch((error) => console.warn("The error from getSharedIndexList", error));
    // }
    //
    // function resolveCommentPromise (itrId) {
    //     const data = getCommentList(itrId).catch(console.error);
    //     console.log(data)
    //     return data;
    // }

    function postComment(sharedItrineraryIndex, commentsVal) {
        setPostingStatus(true);
        console.log("sharedItrineraryIndex in postcomment:" + sharedItrineraryIndex+","+commentsVal);
        if (sharedItrineraryIndex !== null) {
            //post to shared table
            postItineraryComment(currentuser, sharedItrineraryIndex, commentsVal).then(() => {
                setPostingStatus(false);

            })
                .catch((error) => console.warn("The error from shareItem", error))
        }
    }



    //const [testimonials, setTestimonials] = useState(getShared());
    console.log("Testimonials2:"+ testimonials);

    // const handleCommentText = (e) => {
    //     commentsText.push(e.target.value);
    // };

    const submitCommentText = (sharedItrineraryIndex) => {
        let commentsVal = document.getElementById('' + sharedItrineraryIndex);
        //setcommentsText(commentsVal);
        postComment(sharedItrineraryIndex, commentsVal.value);
    };

    // const enableCommentButton = () => {
    //     return (commentsText ? false : true);
    // }
    // const changeCommentButtonStyle = () => {
    //     return (commentsText ? "comments-button-enabled" :
    //         "comments-button-disabled");
    // }
    function isSharedItrComment(sharedItineraryId, commentItineraryId) {
        console.log("given index: " + sharedItineraryId+","+commentItineraryId);
        //check if index exists in the shared list maintained in state
        console.log("index included? " + sharedItineraryId.equals(commentItineraryId))
        return sharedItineraryId.equals(commentItineraryId);

    }

    function deleteItem(index) {
        setDeletingStatus(true);
        let deleteItinerary = testimonials[index];
        deleteSharedItinerary(currentuser, deleteItinerary.itinerary_id).then(() => {
            setTestimonials([...testimonials.slice(0, index), ...testimonials.slice(index+1)])
            setDeletingStatus(false);

        })
            .catch((error) => console.warn("The error from shareItem", error))

        deleteSharedItineraryComments(currentuser, deleteItinerary.itinerary_id).then(() => {
            setTestimonials([...testimonials.slice(0, index), ...testimonials.slice(index+1)])

        })
            .catch((error) => console.warn("The error from shareItem", error))


    }

    const enableDeleteButton = (createdEmail) => {
        return (currentuser.email !== createdEmail ? false : true);
    }

    return (
        <sharedItrWrapper>
            <div className={SharedItrModuleCss['shared-page-bg']}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <button className={Styles['signup']} onClick={() => navigate('/profile')}>Go back to Profile</button>
                </div>
                {deletingStatus ? null :
                <MDBContainer className={SharedItrModuleCss['shared-page-container']}>
                    {testimonials.map((testimonial, index) => (
                        <MDBCard className={SharedItrModuleCss['shared-page-card']}>
                            <MDBCardBody>
                                <div className="d-flex justify-content-between text-center">
                                    <div className="d-flex mb-3">
                                        <div>
                                            <div className="d-flex justify-content-center">
                                                <a href="#">
                                                    <img
                                                        src={ironManImage}
                                                        className="border rounded-circle me-2"
                                                        alt="Avatar"
                                                        style={{ height: "40px" }}
                                                    />
                                                </a>
                                            </div>
                                        </div>


                                        <div>
                                            <div className="d-flex">
                                                <div className={SharedItrModuleCss['shared-user-name']} >
                                                    <div className="text-dark mb-0">
                                                        <strong> {testimonial.created_user_email}</strong>
                                                    </div>
                                                </div>
                                                <div>
                                                    {deletingStatus? null : <DeleteItem action={() => deleteItem(index)} displayDelete={enableDeleteButton(testimonial.created_user_email)}/>}
                                                </div>

                                                {/*<button className={Styles['icon']} onClick={deleteItem(index)} disabled={enableDeleteButton(testimonial.created_user_email)} >*/}
                                                {/*    <DeleteOutlined />*/}
                                                {/*</button>*/}
                                            </div>
                                            {/*<a*/}
                                            {/*    href="#"*/}
                                            {/*    className="text-muted d-block"*/}
                                            {/*    style={{ marginTop: "-6px" }}*/}
                                            {/*>*/}
                                            {/*    <small>Just now</small>*/}
                                            {/*</a>*/}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <ul className={`${Styles['itinerarySection']} ${Styles['itinerarySelect']}`}>
                                        <li className="each-comment" key={index} >{testimonial.itinerary_name}</li>
                                        <li className="each-comment" key={index} >Trip Starts on {testimonial.start_date}</li>
                                        {/*<li className="each-comment" key={index} >{testimonial.action_with_date.split(" | ")[0]} on {testimonial.action_with_date.split(" | ")[1]}</li>*/}
                                    </ul>
                                </div>
                            </MDBCardBody>
                            <MDBRipple
                                className="bg-image hover-overlay ripple rounded-0"
                                rippleTag="div"
                                rippleColor="light"
                            >
                                <a href="#!">
                                    <div
                                        className="mask"
                                        style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                                    ></div>
                                </a>
                            </MDBRipple>
                            <MDBCardBody>
                                <div className="d-flex justify-content-between mb-3">
                                    {/*<div>*/}
                                    {/*    <a href="#!" className="text-muted">*/}
                                    {/*        8 comments*/}
                                    {/*    </a>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="d-flex justify-content-between text-center border-top border-bottom mb-4">
                                    {/*<MDBBtn size="lg" rippleColor="dark" color="link">*/}
                                    {/*    <MDBIcon fas icon="thumbs-up" className="me-2" /> Like*/}
                                    {/*</MDBBtn>*/}
                                    {/*<MDBBtn size="lg" rippleColor="dark" color="link">*/}
                                    {/*    <MDBIcon fas icon="comment-alt" className="me-2" /> Comments*/}
                                    {/*</MDBBtn>*/}
                                    {/*<MDBBtn size="lg" rippleColor="dark" color="link">*/}
                                    {/*    <MDBIcon fas icon="share" className="me-2" /> Share*/}
                                    {/*</MDBBtn>*/}
                                </div>
                                <div className="d-flex mb-3">
                                    <a href="#">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/new/avatars/18.webp"
                                            className="border rounded-circle me-2"
                                            alt="Avatar"
                                            style={{ height: "40px" }}
                                        />
                                    </a>
                                    <MDBTextArea
                                        label="Comment"
                                        id={testimonial.itinerary_id}
                                        rows={2}
                                        wrapperClass="w-100"
                                        ref={commentInputRef}
                                    />
                                    <div className={SharedItrModuleCss['shared-page-postcomment']} >
                                    <MDBBtn size="lg" color="link" onClick={() => {submitCommentText(testimonial.itinerary_id)}}>
                                        <mdb-icon fas icon="comment">Post</mdb-icon>
                                        {/*<MDBIcon fas icon="comment-alt" className="me-2" /> Post*/}
                                    </MDBBtn>
                                </div>
                                </div>

                                {/*{isSharedItrComment(itineraryItem.id)? <CheckItem /> : <ShareItem action={() => shareItem(itineraryItem.id)} />}*/}

                                {postingStatus? null : <CommentContainer itrId={testimonial.itinerary_id} />}

                            </MDBCardBody>
                        </MDBCard>
                    ))}
                </MDBContainer> }
            </div>
        </sharedItrWrapper>
    );
}