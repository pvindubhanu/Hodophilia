import PageWrapper from './wrappers/wrapper-regularPage';
import Search from '../form-search.jsx';
import { useEffect, useState} from 'react';
import tw from "twin.macro";
import { motion } from "framer-motion";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

const PrimaryButton = tw.button`px-8 py-3 font-bold rounded bg-blue-700 text-gray-100 hocus:bg-blue-700 hocus:text-gray-200 focus:outline focus:outline-none transition duration-300`;

const Container = tw.div`relative`;
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
const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-slate-700`;


export default function Index() {

    const [topPlaces, setTopPlaces] = useState(null);
    const handleTopPlaces = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }

        fetch('http://localhost:8080/api/locations/ratings/topPlaces', requestOptions)
        .then(res => res.json())
        .then(res => {
            setTopPlaces(res) 
          }
        )
        .catch((error)=> alert(error.message))

        // "/api/locations//ratings/topPlaces"
    }

    useEffect(() => {
        handleTopPlaces()
    }, [])
    
    return (
        <PageWrapper>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: '1.5em'}}>
                <Search />
                <Header>Hodophilia Recommends</Header>

                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "90vw", marginTop: "50px"}}>

                {topPlaces != null &&  topPlaces.map((data, index) =>  <>
                    <Card className="group" initial="rest" whileHover="hover" animate="rest" style={{width: "20vw"}}>

                        <CardImageContainer imageSrc={'http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcT_SiyEVLIjCT1bJcTL9h1doLZPtFKpOYlX1ZPMznjhS2Nf1mF4oXY6FRCZU7lIX2nr'}>
                        
                        </CardImageContainer>
                      
                                <CardTitle>{data.name}</CardTitle>
                                
                
                        <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <label>User's Ratings </label>
                        <p style={{display: "block"}}>{data.ratings}</p>
                        </div>
                        </Card>

                        </>)
                        
         
                }
                </div>
            </div>
        </PageWrapper>
    )
}