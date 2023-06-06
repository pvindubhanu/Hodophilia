import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../contexts/loginContext";
import CityService, { LocationData } from "../../services/city";
import ItineraryService from '../../services/itinerary';
import PageWrapper from "./wrappers/wrapper-regularPage";
import AddItineraryItem from "../button-liAddItineraryItem";
import StarRating from "../graphic-starRating";

import Styles from '../css/searchedcity.module.css';
import tw from "twin.macro";
import AnimatedContainer from "../helpers/AnimatedContainer";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { motion } from "framer-motion";
import { NodeExpandOutlined } from "@ant-design/icons";

const GET_HOTEL_API ="http://localhost:8080/api/hotels/";
const GET_RESTAURANT_API = "http://localhost:8080/api/restaurants/";
const Container = tw.div`relative`;
const PrimaryButton = tw.button`px-8 py-3 font-bold rounded bg-blue-700 text-gray-100 hocus:bg-blue-700 hocus:text-gray-200 focus:outline focus:outline-none transition duration-300`;
const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw.h2`text-4xl sm:text-5xl font-black tracking-wide text-center`
const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;
const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${props => props.active && tw`bg-blue-500! text-gray-100!`}
  }
`;

const TabContent = tw(motion.div)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;
const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(motion.a)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;
const CardRatingContainer = tw.div`leading-none absolute inline-flex bg-gray-100 bottom-0 left-0 ml-4 mb-4 rounded-full px-5 py-2 items-end`;
const CardRating = styled.div`
  ${tw`mr-1 text-sm font-bold flex items-end`}
  svg {
    ${tw`w-4 h-4 fill-current text-orange-400 mr-1`}
  }
`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardButton = tw(PrimaryButton)`text-sm`;

const CardReview = tw.div`font-medium text-xs text-gray-600`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-slate-700`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;


export default function SearchedCity () {

    const currentuser = useContext(LoginContext);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [cityIsCorrect, setCityIsCorrect] = useState(undefined);
    const [cityData, setCityData] = useState(undefined);
    
    const tabNames = ['Hotels','Things to Do','Restaurants','Travel Advice'];
    const tabKeys = ['_hotels', '_thingsToDo', '_restaurants', '_travelAdvice'];
    const [activeTab, setActiveTab] = useState(tabKeys[0]);
    const [rating, setRating] = useState(null);
    
    function isLastLocation() {
        if (!currentuser) return false;
        let ci = currentuser.getItinerary();
        if (ci && ci.locationId && ci.locationId.length > 0 && cityData) {
            if (ci.locationId[ci.locationId.length - 1].id === cityData.getPlaceID()) return true;
            else return false;
        }
        else return false;
    }
    
    const [lastLocationSelected, setLastLocation] = useState(isLastLocation());

    const onCityInfoGrabFailure = (errorResponse) => {
        console.error(errorResponse);
        setCityData(null);
        setCityIsCorrect(false);
    }

    async function getCityInfo(){
        let name = searchParams.get("city")
        // let location = searchParams.get("location")

        let locationObject = new LocationData(name);

        if (name === "") {
            onCityInfoGrabFailure("Name variable (from searchParams.get(\"city\")) is empty.");
            return;
        }

        try {

            await CityService.getCityInfo(name, locationObject);
            await CityService.getHotelInfo(name, locationObject);
            await CityService.getRestaurantInfo(name, locationObject);
            setCityData(locationObject);
            setCityIsCorrect(true);

        }
        catch (e) {
            onCityInfoGrabFailure(e);
        }
        
    }
    
    useEffect(() => {
        getCityInfo();
    }, [])

    useEffect(() => {
        setLastLocation(isLastLocation())
    }, [cityData])

    function addToItinerary(locationName) {
        if (!currentuser) navigate('/login');
        else {
            let ci = currentuser.getItinerary();

            if (ci === null) {
                navigate('/profile');
            }

            else {
                   
                CityService.getCityInfo(locationName)
                    .then(response => {
                        console.log("response: ", response)
                        let id = response._placeID;
    
                        ci.locationId = [...ci.locationId, { id, details: undefined }];
                        console.log(ci);
    
                        ItineraryService.updateItineraryData(currentuser, ci.itineraryId, ci)
                            .then(() => {
                                setLastLocation(true);
                            })
                    })
            }
        }
    }



    function generateHotelButton(data) {
        let text, clickAction = () => { };
        if (currentuser.token !== '' && currentuser.getItinerary() !== null) {
            clickAction = () => { navigate('/hotel-booking', { state: data }) };
            text = `Add hotel to active itinerary`;
        }
        else if (currentuser.token !== '') {
            clickAction = () => { navigate('/profile') }
            text = "Create new itinerary";
        }
        else {
            clickAction = () => { navigate('/login') }
            text = "Login to add to itinerary";
        }
        return (
            <Card className="group" initial="rest" whileHover="hover" animate="rest">
                <CardText>
                    <CardButton onClick={clickAction}>{text}</CardButton>
                </CardText>
            </Card>
        );
    }

    function submitRating(ratings, id, key) {

        // alert(key)
        console.log(JSON.stringify({key:key, name:key, "ratings": ratings}))

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  },
            body: JSON.stringify({key:key, name:key, "ratings": ratings})
        };

        if(key == "HOTEL"){
            fetch(GET_HOTEL_API + `ratings/update/${id}`, requestOptions)
            .then(res => res.json())
        }
        else {
            fetch(GET_RESTAURANT_API + `ratings/update/${id}`, requestOptions)
            .then(res => res.json())
        }
    }

    function cardDisplay(type, data) {
        let key = null;
        switch(type) {
            case '_hotels': key = "HOTEL";
            case '_restaurants': {
                if(key == null) key = "RESTAURANT";
                return ( <>
                    <Card className="group" initial="rest" whileHover="hover" animate="rest">
                        <CardImageContainer imageSrc={'http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcT_SiyEVLIjCT1bJcTL9h1doLZPtFKpOYlX1ZPMznjhS2Nf1mF4oXY6FRCZU7lIX2nr'}>
                            <CardText>
                                <CardHoverOverlay
                                    variants={{
                                        hover: {
                                            opacity: 1,
                                            height: "auto"
                                        },
                                        rest: {
                                            opacity: 0,
                                            height: 0
                                        }
                                    }}
                                    style={{flexDirection: 'column'}}
                                    transition={{ duration: 0.3 }}
                                    >

                                        <CardTitle>Contact info:</CardTitle>
                                        <p style={{display: "block"}}>{data.phone}</p>
                                        <p style={{display: "block"}}>{data.email}</p>
                                        

                                        {(type === '_hotels') ? generateHotelButton(data) : null}

                                    {/* <CardButton>Add to existing itinerary</CardButton> */}
                                </CardHoverOverlay>
                            </CardText>
                        </CardImageContainer>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <CardTitle>{data.name}</CardTitle>
                                <StarRating rating={data.starCount} />
                        </div>
                        <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <label>User's Ratings </label>
                        <p style={{display: "block"}}>{data.ratings}</p>
                        </div>
                        <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <label>Enter Ratings </label>
                        <input style={{display: "block", height:"25px", width: "50px"}} max="5" min="1" type={"number"} onChange={e => setRating(e.target.value)}></input>
                        <button onClick={(e) => submitRating(rating, data.id, key)}>Submit</button>
                        </div>
                        <p>{data.address}</p>
                    </Card></>
                )};
            default:
                return (
                    <Card className="group" initial="rest" whileHover="hover" animate="rest">
                        <CardImageContainer imageSrc={'http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcT_SiyEVLIjCT1bJcTL9h1doLZPtFKpOYlX1ZPMznjhS2Nf1mF4oXY6FRCZU7lIX2nr'}>
                            {/* <CardHoverOverlay
                                variants={{
                                    hover: {
                                        opacity: 1,
                                        height: "auto"
                                    },
                                    rest: {
                                        opacity: 0,
                                        height: 0
                                    }
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <CardButton>Add to existing itinerary</CardButton>
                            </CardHoverOverlay> */}
                        </CardImageContainer>
                        <CardText>
                            <CardTitle>{data}</CardTitle>
                        </CardText>
                    </Card>
                );
        }
    }

    if (cityData === undefined) { // change this later
        return (
            <PageWrapper>
                <h1>Searching... </h1>
            </PageWrapper>
        )
    }
    else if (cityIsCorrect) {
        return (
            <AnimatedContainer>
                <Container>
                        <HeaderRow>
                            <Header>{'Explore ' + cityData.getName()}</Header>
                            <TabsControl>
                                {tabKeys.map((tabKey, index) => (
                                    <TabControl key={index} active={activeTab === tabKey} onClick={() => setActiveTab(tabKey)}>
                                        {tabNames[index]}
                                    </TabControl>
                                ))}
                            </TabsControl>
                        </HeaderRow>
                        {Object.keys(cityData).map((tabKey, index) => {
                            console.log(tabKey);
                            if (tabKeys.includes(tabKey)) {
                                return (
                                    <TabContent
                                        key={tabKey}
                                        variants={{
                                            current: {
                                                opacity: 1,
                                                scale: 1,
                                                display: "flex",
                                            },
                                            hidden: {
                                                opacity: 0,
                                                scale: 0.8,
                                                display: "none",
                                            }
                                        }}
                                        transition={{ duration: 0.4 }}
                                        initial={activeTab === tabKey ? "current" : "hidden"}
                                        animate={activeTab === tabKey ? "current" : "hidden"}
                                    >

                                        {cityData[tabKey].map((card, index) => {
                                            console.log(tabKey, card);
                                            return (

                                            <CardContainer key={index}>
                                                {cardDisplay(tabKey, card)}
                                            </CardContainer>
                                        )})}
                                        
                                    </TabContent>
                                )
                            }
                        }
                        )
                        }
                        <TabContent>
                            <CardText>
                                <CardButton onClick={
                                    () => {
                                        if (!lastLocationSelected) addToItinerary(cityData.getName());
                                    }
                                }>
                                    {lastLocationSelected ? "Added to itinerary" : "Add to itinerary"}
                                    <AddItineraryItem
                                        alt={`Add ${cityData.getName() } to itinerary`}
                                        isActive={lastLocationSelected}
                                        style={{backgroundColor: "transparent", outline: "none", border: '0', color: "var(--color4)"}}
                                        />
                                </CardButton>
                            </CardText>
                        </TabContent>
                </Container>
            </AnimatedContainer>
        )
    }
    else return (
             <PageWrapper>
                <h1>City not found </h1>
             </PageWrapper>

        )
}