import { SelectFormInput, TextFormInput, CheckFormInput } from "@/components";
import { Controller, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { Card, CardBody, CardHeader, Col, Row, Button } from "react-bootstrap";
import { useWizard } from "react-use-wizard";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../config/env";

const Step3 = ({ isEdit }) => {
  const { control, watch } = useFormContext();
  const { previousStep } = useWizard();
  const [offers, setOffers] = useState([]);

  const isOfferApplied = watch("isOfferApplied");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/customer/offers/all`
        );
        const result = await response.json();
        if (result.success) {
          setOffers(result.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="vstack gap-4">
      <h4 className="mb-0">Price &amp; Policy</h4>
      <Card className="shadow">
        <CardHeader className="border-bottom">
          <h5 className="mb-0">Listing Price</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-4">
            <Col md={6}>
              <label className="form-label">Currency</label>
              <Controller
                name="currency"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <SelectFormInput
                      {...field}
                      className="form-select js-choice border-0 z-index-9 bg-transparent"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EURO">EURO</option>
                    </SelectFormInput>
                    {error && (
                      <div className="text-danger small mt-1">
                        {error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </Col>
            <TextFormInput
              name="basePrice"
              label="Base Price *"
              control={control}
              containerClass="col-md-6"
            />
            <TextFormInput
              name="discount3"
              label="Discount *"
              control={control}
              containerClass="col-md-6"
            />
          </Row>
        </CardBody>
      </Card>

      <Card className="shadow">
        <CardHeader className="border-bottom">
          <h5 className="mb-0">Offers &amp; Policy</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-4">
            {/* <Col xs={12}>
              <label className="form-label">Apply Offer?</label>
              <div className="d-flex gap-3">
                <CheckFormInput
                  name="isOfferApplied"
                  control={control}
                  label="No"
                  type="radio"
                  id="offer-no"
                  value={false}
                  containerClass="form-check"
                />
                <CheckFormInput
                  name="isOfferApplied"
                  control={control}
                  label="Yes"
                  type="radio"
                  id="offer-yes"
                  value={true}
                  containerClass="form-check"
                />
              </div>
            </Col> */}

            {isOfferApplied && (
              <Col md={12}>
                <label className="form-label">Select Offer *</label>
                <Controller
                  name="selectedOffer"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <SelectFormInput {...field} className="form-select">
                        <option value="">Choose an offer</option>
                        {offers.map((offer) => (
                          <option key={offer._id} value={offer._id}>
                            {offer.title}
                          </option>
                        ))}
                      </SelectFormInput>
                      {error && (
                        <div className="text-danger small mt-1">
                          {error.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </Col>
            )}

            <Col xs={12}>
              <label className="form-label">Add description *</label>
              <Controller
                name="listingPolicyDescription"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <ReactQuill
                      value={field.value}
                      onChange={field.onChange}
                      theme="snow"
                    />
                    {error && (
                      <div className="text-danger small mt-1">
                        {error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </Col>
            <TextFormInput
              name="charges"
              label="Charges *"
              control={control}
              containerClass="col-md-6"
            />
          </Row>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between">
        <button
          type="button"
          onClick={previousStep}
          className="btn btn-secondary prev-btn mb-0"
        >
          Previous
        </button>
        <Button
          type="submit"
          variant={isEdit ? "primary" : "success"}
          className="mb-0"
        >
          {isEdit ? "Update Listing" : "Add Listing"}
        </Button>
      </div>
    </div>
  );
};

export default Step3;
