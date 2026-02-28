import { PageMetaData } from "@/components";
import AddressMap from "./components/AddressMap";
import ContactForm from "./components/ContactForm";
import FooterWithLinks from "./components/FooterWithLinks";
import Hero from "./components/Hero";
import TopNavBar11 from "./components/TopNavBar11";
import TopNavBar from "../../hotels/Home/components/TopNavBar";
const Contact = ({ showHero = true }) => {
  return (
    <>
      <PageMetaData title="Contact Us" />

      <TopNavBar />

      <main>
        <Hero showHero={showHero} />
        {!showHero && (
          <div className="container">
            <div className="row">
              <div className="co-md-12">
                <img
                  src="https://res.cloudinary.com/djnaor5ed/image/upload/v1772266961/Strategic_Pricing_Quality_Guest_Screening_Strong_Online_Presence_Transparent_Process_1_zgzoxh.webp"
                  className="rounded w-100"
                />
              </div>
            </div>
          </div>
        )}
        <ContactForm />
        {showHero && <AddressMap />}
      </main>

      <FooterWithLinks />
    </>
  );
};
export default Contact;
