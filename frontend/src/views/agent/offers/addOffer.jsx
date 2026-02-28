import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
  Form,
} from "react-bootstrap";
import {
  PageMetaData,
  TextFormInput,
  TextAreaFormInput,
  FileFormInput,
} from "@/components";

import Footer from "../../listings/Added/components/Footer";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../../../config/env";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import TopNavBar from "../../hotels/Home/components/TopNavBar";
import AgentNavBar from "../../../layouts/AgentLayout/AgentNavBar";

const AddOffer = () => {
  const [submitting, setSubmitting] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const token = localStorage.getItem("token");

  const offerSchema = yup.object({
    title: yup.string().required("Please enter the offer title"),
    description: yup.string().required("Please enter a description"),
    isDisabled: yup.boolean(),
    // appliedProperties: yup
    //   .array()
    //   .min(1, "Please select at least one property"),
    offerImage: isEditMode
      ? yup.mixed().notRequired()
      : yup.mixed().required("Please upload an offer image"),
  });

  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      offerImage: null,
      isDisabled: false,
      appliedProperties: [],
    },
  });

  console.log("Apply to Properties------------", properties);

  // const propertyOptions = properties.map((prop) => ({
  //   value: prop._id,
  //   label: prop.listingName,
  // }));

  const propertyOptions = properties
    .filter((prop) => prop.availableOffers.length === 0)
    .map((prop) => ({
      value: prop._id,
      label: prop.listingName,
    }));

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/shops/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setProperties(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };
    fetchMyProperties();
  }, [token]);

  useEffect(() => {
    if (isEditMode) {
      const getOfferDetails = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/v1/shops/offer/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) {
            const offerData = res.data.data;
            reset({
              title: offerData.title,
              description: offerData.description,
              isDisabled: offerData.isDisabled,
              appliedProperties: offerData.appliedProperties || [],
              offerImage: null,
            });
            setExistingImage(offerData.image);
          }
        } catch (error) {
          toast.error("Failed to load offer data");
        }
      };
      getOfferDetails();
    }
  }, [id, isEditMode, token, reset]);

  useEffect(() => {
    document.body.classList.add("dashboard");
    return () => {
      document.body.classList.remove("dashboard");
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const payload = {
        title: data.title,
        description: data.description,
        isDisabled: data.isDisabled,
        appliedProperties: data.appliedProperties,
      };

      if (data.offerImage && data.offerImage.base64) {
        payload.image = data.offerImage.base64;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const resp = isEditMode
        ? await axios.patch(
            `${API_BASE_URL}/api/v1/shops/offer/${id}`,
            payload,
            config
          )
        : await axios.post(
            `${API_BASE_URL}/api/v1/shops/offer`,
            payload,
            config
          );

      if (resp.status === 200 || resp.status === 201) {
        Swal.fire({
          title: "Success!",
          text: `Offer has been ${
            isEditMode ? "updated" : "added"
          } successfully`,
          icon: "success",
        });
        navigate("/agent/offers");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMetaData title={isEditMode ? "Edit Offer" : "Add New Offer"} />
      <TopNavBar />
      <AgentNavBar />
      <main className="py-1">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow">
                <CardHeader className="border-bottom">
                  <h5 className="mb-0">
                    {isEditMode ? "Update Offer" : "Create New Offer"}
                  </h5>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="g-4">
                      <Col xs={12}>
                        <TextFormInput
                          name="title"
                          label="Offer Title"
                          placeholder="Enter offer title"
                          control={control}
                        />
                      </Col>

                      <Col xs={12}>
                        <Form.Label>Apply to Properties</Form.Label>
                        <Controller
                          name="appliedProperties"
                          control={control}
                          render={({ field, fieldState }) => (
                            <>
                              <Select
                                isMulti
                                options={propertyOptions}
                                className={clsx("react-select-container", {
                                  "is-invalid": !!fieldState.error,
                                })}
                                classNamePrefix="react-select"
                                placeholder="Select properties..."
                                value={propertyOptions.filter((opt) =>
                                  field.value?.includes(opt.value)
                                )}
                                onChange={(val) =>
                                  field.onChange(val.map((v) => v.value))
                                }
                              />
                              {fieldState.error && (
                                <div className="text-danger small mt-1">
                                  {fieldState.error.message}
                                </div>
                              )}
                            </>
                          )}
                        />
                      </Col>

                      <Col xs={12}>
                        <TextAreaFormInput
                          name="description"
                          label="Description"
                          placeholder="Describe the offer details"
                          rows={4}
                          control={control}
                        />
                      </Col>

                      {isEditMode && existingImage && !watch("offerImage") && (
                        <Col xs={12}>
                          <label className="form-label d-block">
                            Current Image
                          </label>
                          <img
                            src={existingImage}
                            alt="Current Offer"
                            className="rounded border"
                            style={{
                              width: "150px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </Col>
                      )}

                      <Col xs={12}>
                        <FileFormInput
                          name="offerImage"
                          label={
                            isEditMode
                              ? "Upload New Image (Optional)"
                              : "Offer Image *"
                          }
                          control={control}
                        />
                      </Col>
                      <Col xs={12} className="text-end">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <Spinner size="sm" />
                          ) : isEditMode ? (
                            "Update Offer"
                          ) : (
                            "Create Offer"
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default AddOffer;
