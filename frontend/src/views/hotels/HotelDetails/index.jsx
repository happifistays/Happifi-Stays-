import { PageMetaData } from "@/components";
import AboutHotel from "./components/AboutHotel";
import AvailabilityFilter from "./components/AvailabilityFilter";
import FooterWithLinks from "./components/FooterWithLinks";
import HotelGallery from "./components/HotelGallery";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopNavBar from "../Home/components/TopNavBar";
import Footer from "../Home/components/Footer";
import { API_BASE_URL } from "../../../config/env";
import { useAuthContext } from "@/states/useAuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (id) {
      fetch(`${API_BASE_URL}/api/v1/customer/property/${id}`)
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data) setHotel(result.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (id && checkIn && checkOut) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/v1/customer/check-property-availability/${id}`,
            {
              params: {
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString(),
              },
            }
          );
          setIsAvailable(res.data.available);
        } catch (error) {
          setIsAvailable(false);
        }
      }
    };
    checkAvailability();
  }, [id, checkIn, checkOut]);

  const handleBookNow = () => {
    if (!user) {
      Swal.fire({
        title: "Please Signin",
        text: "You need to create account to book",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sign-In",
      }).then((result) => {
        if (result.isConfirmed) navigate("/auth/sign-in");
      });
      return;
    }

    if (!checkIn || !checkOut) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Select check-in and check-out dates",
      });
      return;
    }

    if (!isAvailable) {
      Swal.fire({
        icon: "error",
        title: "Unavailable",
        text: "Property is booked for these dates",
      });
      return;
    }

    const nights = Math.ceil(
      Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );
    const total = (hotel?.basePrice || 0) * nights;

    const bookingData = {
      propertyId: hotel?._id,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      nights,
      roomPrice: hotel?.basePrice,
      total,
      currency: hotel?.currency || "USD",
      hotelName: hotel?.listingName,
    };

    navigate(`/hotels/booking?property_id=${hotel?._id}`, {
      state: bookingData,
    });
  };

  if (loading) return null;

  return (
    <>
      <PageMetaData title="Hotel - Details" />
      <TopNavBar />
      <main>
        {!hotel ? (
          <div className="text-center py-5">No details found</div>
        ) : (
          <>
            <AvailabilityFilter />
            <HotelGallery
              hotelDetails={{
                name: hotel.listingName,
                address: hotel.location,
              }}
              gallery={hotel.gallery}
            /> 
            <AboutHotel
              hotelDetails={{
                about: hotel.shortDescription,
                amenities: hotel.amenities ?? [],
                rate: hotel.basePrice,
                rating: hotel.starRating ?? 0,
              }}
              propertyId={hotel._id}
              checkIn={checkIn}
              checkOut={checkOut}
              setCheckIn={setCheckIn}
              setCheckOut={setCheckOut}
              handleBookNow={handleBookNow}
              isAvailable={isAvailable}
            />
          </>
        )}
      </main>
      <FooterWithLinks />
      <Footer />
    </>
  );
};
export default HotelDetails;
