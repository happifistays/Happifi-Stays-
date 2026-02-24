import { PageMetaData } from "@/components";
import PersonalInformation from "./components/PersonalInformation";
import ProfileProgress from "./components/ProfileProgress";
import UpdateEmail from "./components/UpdateEmail";
import UpdatePassword from "./components/UpdatePassword";
import CustomerInformation from "./components/customerInformation";
import { useAuthContext } from "../../../states/useAuthContext";

const CustomerProfile = () => {
  const { user } = useAuthContext();
  return (
    <>
      <PageMetaData title="User Profile" />

      <div className="vstack gap-4">
        {/* <ProfileProgress /> */}

        <CustomerInformation />

        {/* <UpdateEmail /> */}
        {user?.provider !== "google" && <UpdatePassword />}
      </div>
    </>
  );
};
export default CustomerProfile;
