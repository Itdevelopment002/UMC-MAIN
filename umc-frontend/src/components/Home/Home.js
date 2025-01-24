import React, { useEffect } from "react";
import Carousel from "../Carousel/Carousel";
import CurrentUpdate from "../CurrentUpdate/CurrentUpdate";
import Info from "../Info/Info";
import EServices from "../EServices/EServices";
import CitizenServices from "../CitizenServices/CitizenServices";
import GalleryAndCommunication from "../GalleryAndCommunication/GalleryAndCommunication";
import SocialMediaSection from "../SocialMediaSection/SocialMediaSection";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Carousel />
      <CurrentUpdate />
      <Info />
      <CitizenServices />
      <EServices />
      <GalleryAndCommunication />
      <SocialMediaSection />
    </>
  );
};

export default Home;
