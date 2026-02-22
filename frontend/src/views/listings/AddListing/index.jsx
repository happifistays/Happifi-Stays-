import { PageMetaData } from '@/components';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ListingForms from './components/ListingForms';
import TopNavBar4 from './components/TopNavBar4';
import TopNavBar from '../../hotels/Home/components/TopNavBar';
const AddListing = () => {
  return <>
      <PageMetaData title="Listings - Add Listing" />

      <TopNavBar />

      <main>
        <Hero />
        <ListingForms />
      </main>

      <Footer />
    </>;
};
export default AddListing;