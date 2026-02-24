import { PageMetaData } from "@/components";
import FooterWithLinks from "./components/FooterWithLinks";
import Hero from "./components/Hero";
import HotelGridLayout from "./components/HotelGridLayout";
import HotelListFilter from "./components/HotelListFilter";
import TopNavBar from "../Home/components/TopNavBar";
import { useState } from "react";

const HotelsGrid = () => {
  const [filters, setFilters] = useState({});

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <PageMetaData title="Hotel - Grid" />
      <TopNavBar />
      <main>
        <Hero />
        <HotelListFilter onApplyFilters={handleApplyFilters} />
        <HotelGridLayout filters={filters} />
      </main>
      <FooterWithLinks />
    </>
  );
};
export default HotelsGrid;
