import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import tw from "twin.macro";
import PageWrapper from './wrappers/wrapper-regularPage';
import Styles from "../css/navbar.module.css";
import {LoginContext} from "../../contexts/loginContext";
import {getAllSharedItinerary} from "../../services/sharedItinerary";
import Comments from "../comments";

const SectionHeading = tw.h2`text-4xl sm:text-5xl font-black tracking-wide text-center`;
const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;
const TestimonialsContainer = tw.div`mt-16 lg:mt-0`;
const Testimonials = styled.div``;
const Testimonial = tw.div`max-w-md lg:max-w-none mx-auto lg:mx-0 flex flex-col items-center lg:items-stretch lg:flex-row`;

const TestimonialText = tw.div`outline-none`;

const Image = styled.div(props => [
    `background-image: url("${props.imageSrc}");`,
    tw`rounded bg-cover bg-center h-80 sm:h-96`
]);

const TextContainer = styled.div(props => [
    tw`flex flex-col w-full lg:w-7/12`,
    props.textOnLeft ? tw`lg:pr-12 lg:order-first` : tw`lg:pl-12 lg:order-last`
]);

const HeadingTitle = tw(SectionHeading)`lg:text-left leading-tight`;
const Description = tw.p`max-w-md text-center mx-auto lg:mx-0 lg:text-left lg:max-w-none leading-relaxed text-sm sm:text-base lg:text-lg font-medium mt-4 text-stone-100`;

const QuoteContainer = tw.div`relative mt-10 lg:mt-20`;
const Quote = tw.blockquote`text-center lg:text-left text-sm sm:text-lg lg:text-xl xl:text-2xl`;
const CustomerInfo = tw.div`mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start`;
const CustomerTextInfo = tw.div`text-center lg:text-left sm:ml-6 mt-2 sm:mt-0`;
const CustomerName = tw.h5`font-semibold text-xl lg:text-2xl xl:text-3xl text-gray-500`;
const CustomerTitle = tw.p`font-medium text-stone-100`;
const heading = "Testimonials";
const imageSrc = "https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80";
const description = "Here are what some of our amazing customers are saying about our hotels & tours. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
let testimonials_mock = [
    {
        quote:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        customerName: "Charlotte Hale",
        customerTitle: "CEO, Delos Inc."
    },
    {
        quote:
            "Sinor Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        customerName: "Adam Cuppy",
        customerTitle: "Founder, EventsNYC"
    }
];

//let testimonials = [];
const textOnLeft = false;
const HeadingInfo = ({ heading, description, ...props }) => (
    <div {...props}>
        <HeadingTitle>{heading}</HeadingTitle>
        <Description>{description}</Description>
    </div>
);



export default function Shared() {

    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();
    // const fetchAllSharedIItinerary = async () => {
    //     testimonials = await getAllSharedItinerary(currentuser);
    // }
    // fetchAllSharedIItinerary().catch(console.error);
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        //let dataSet = true;
        //let getShared = currentuser.getItinerary();
        //if (getShared !== null && getShared !== undefined) {
            const fetchAllSharedIItinerary = async () => {
                // .then((result) => {
                //     console.log("In shared get call:" + result);
                //     if (dataSet) {
                //         setTestimonials(result);
                //
                //     }
                //
                // }).catch((error) => console.warn("The error from getSharedIndexList", error));
                let result = await getAllSharedItinerary(currentuser);
                //testimonials.push(result);
                setTestimonials(result);
            }

            fetchAllSharedIItinerary().catch(console.error);
            //return () => dataSet = false;
        //}

    }, [])



    //const [testimonials, setTestimonials] = useState(getShared());
    console.log("Testimonials2:"+ testimonials);



    return (
        <PageWrapper>
            <h1>This is the shared page.</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button className={Styles['signup']} onClick={() => navigate('/profile')}>Go back to Profile</button>
            </div>
            <Container>
                <Content>
                    <HeadingInfo tw="text-center lg:hidden" heading={heading} description={description} />
                    <TestimonialsContainer>
                        <Image imageSrc={imageSrc} />
                        <Testimonials>
                            <HeadingInfo tw="hidden lg:block" heading={heading} description={description} />
                            {testimonials.map((testimonial, index) => (
                                <Testimonial>
                                    <TextContainer textOnLeft={textOnLeft}>

                                        <TestimonialText key={index}>
                                            <QuoteContainer>
                                                <Quote>
                                                    {testimonial.itinerary_name}
                                                </Quote>
                                            </QuoteContainer>
                                            <CustomerInfo>
                                                <CustomerTextInfo>
                                                    <CustomerName>{testimonial.first_travel_day}</CustomerName>
                                                    <CustomerTitle>{testimonial.action_with_date}</CustomerTitle>
                                                    <Comments sharedItineraryId={testimonial.itinerary_id}/>
                                                </CustomerTextInfo>
                                            </CustomerInfo>
                                        </TestimonialText>
                                    </TextContainer>
                                </Testimonial>
                            ))}
                        </Testimonials>
                    </TestimonialsContainer>
                </Content>
            </Container>

        </PageWrapper>
    )
}


