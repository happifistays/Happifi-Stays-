import { PageMetaData } from "@/components";
import AppsLink from "./components/AppsLink";
import Clients from "./components/Clients";
import FeaturedHoliday from "./components/FeaturedHoliday";
import FeaturedHotels from "./components/FeaturedHotels";
import Footer from "./components/Footer";
import FooterWithLinks from "./components/FooterWithLinks";

import NearbyPlaces from "./components/NearbyPlaces";
import OfferSlider from "./components/OfferSlider";
import TestimonialsSlider from "./components/TestimonialsSlider";
import TopNavBar from "./components/TopNavBar";
import Hero from "../Chain/components/Hero";
import Hero1 from "./components/Hero";
import AvailabilityFilter from "./components/AvailabilityFilter";
import { Container } from "react-bootstrap";
const HotelHome = () => {
  return (
    <>
      <PageMetaData title="Hotel - Home" />

      <TopNavBar />
 
      <main>
        {/* <Hero1 /> */}
        <Hero />
        <Container className="pt-3 pt-lg-5">
          <AvailabilityFilter />
        </Container>

        <OfferSlider />

        <FeaturedHoliday />

        <FeaturedHotels />

        {/* <Clients /> */}

        <TestimonialsSlider />

        <NearbyPlaces />

        <AppsLink />
      </main>

      <FooterWithLinks />

      {/* <Footer /> */}
    </>
  );
};
export default HotelHome;
