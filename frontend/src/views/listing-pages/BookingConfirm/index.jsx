import { PageMetaData } from "@/components";
import ConfirmTicket from "./components/ConfirmTicket";
import FooterWithLinks from "./components/FooterWithLinks";
import TopNavBar4 from "./components/TopNavBar4";
import { useLocation } from "react-router-dom";
import TopNavBar from "../../hotels/Home/components/TopNavBar";
const BookingConfirm = () => {
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  return (
    <>
      <PageMetaData title="Booking Confirmed" />

      <TopNavBar />

      <main>
        <ConfirmTicket />
      </main>

      <FooterWithLinks />
    </>
  );
};
export default BookingConfirm;
