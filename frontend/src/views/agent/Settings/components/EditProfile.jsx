import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import { TextFormInput, FileFormInput } from "@/components";
import { Link } from "react-router-dom";
import UpdateEmail from "./UpdateEmail";
import UpdatePassword from "./UpdatePassword";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthContext } from "../../../../states/useAuthContext";
import { toast } from "react-hot-toast";
import { DEFAULT_AVATAR_IMAGE } from "../../../../constants/images";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../../config/env";

const EditProfile = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(DEFAULT_AVATAR_IMAGE);
  const [submitting, setSubmitting] = useState(false);

  const profileSchema = yup.object({
    name: yup.string().required("Please enter your full name"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter your email"),
    mobileNo: yup.string().nullable(),
    location: yup.string().nullable(),
    birthday: yup.mixed().nullable(),
    avatar: yup.mixed().nullable(),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      mobileNo: "",
      location: "",
      birthday: null,
      avatar: null,
    },
  });

  const avatarFile = watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      if (file instanceof File) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [avatarFile]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          reset({
            name: data.name || "",
            email: data.email || "",
            mobileNo: data.contactNumber || "",
            location: data.location || "",
            birthday: data.birthday ? new Date(data.birthday) : null,
            avatar: null,
          });
          setPreview(data.avatar || DEFAULT_AVATAR_IMAGE);
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [reset]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const url = `${API_BASE_URL}/api/v1/shops/profile`;

      // Formatting date to YYYY-MM-DD to ensure payload is correct
      let formattedDate = null;
      if (data.birthday) {
        const dateObj = new Date(data.birthday);
        formattedDate = dateObj.toISOString().split("T")[0];
      }

      const payload = {
        name: data.name,
        contactNumber: data.mobileNo,
        location: data.location,
        birthday: formattedDate,
      };

      console.log("payload-----------", payload);
      console.log("avatarFile------------", avatarFile);

      if (avatarFile && avatarFile.base64) {
        const base64Avatar = avatarFile.base64;
        payload.avatar = base64Avatar;
      }

      setSubmitting(true);
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setSubmitting(false);
      if (response.ok) {
        Swal.fire({
          title: "Good job!",
          text: "You profile updated!",
          icon: "success",
        });
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Row className="g-4">
      <Col xs={12}>
        <Card className="border">
          <CardHeader className="border-bottom">
            <h5 className="card-header-title">Edit Profile</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextFormInput
                name="name"
                label="Name *"
                placeholder="Name"
                containerClass="mb-3"
                control={control}
              />

              <div className="mb-3">
                <label className="form-label">Profile picture *</label>
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xl me-4 flex-shrink-0">
                    <Image
                      className="avatar-img rounded-circle border border-white border-3 shadow"
                      src={preview}
                      alt="avatar"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </span>
                  <div className="flex-grow-1">
                    <FileFormInput
                      name="avatar"
                      control={control}
                      label="Change Profile Picture"
                      showPreview={false}
                    />
                  </div>
                </div>
              </div>

              <TextFormInput
                name="email"
                type="email"
                label="Email id *"
                placeholder="Enter your email id"
                containerClass="mb-3"
                control={control}
                readOnly
              />
              <TextFormInput
                name="mobileNo"
                label="Mobile number *"
                placeholder="Enter your mobile number"
                containerClass="mb-3"
                control={control}
              />
              <TextFormInput
                name="location"
                label="Location *"
                placeholder="Enter your location"
                containerClass="mb-3"
                control={control}
              />
              <div className="mb-3">
                <label className="form-label d-block">Birthday</label>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="Select your birthday"
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                      wrapperClassName="w-100"
                    />
                  )}
                />
              </div>
              <div className="d-flex justify-content-end mt-4">
                <Link to="" className="btn text-secondary border-0 me-2">
                  Discard
                </Link>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <span>Please wait....</span>
                  ) : (
                    <span> Save change</span>
                  )}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
      <Col md={6}>
        <UpdateEmail />
      </Col>
      <Col md={6}>
        <UpdatePassword />
      </Col>
    </Row>
  );
};

export default EditProfile;
