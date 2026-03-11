import { FileFormInput, SelectFormInput, TextFormInput } from "@/components";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { Card, CardBody, CardHeader, Col, Row, Button } from "react-bootstrap";
import { useWizard } from "react-use-wizard";
import { amenities } from "../../../../constants/datas";
import {
  FaConciergeBell,
  FaSwimmingPool,
  FaDumbbell,
  FaParking,
  FaSpa,
  FaUtensils,
} from "react-icons/fa";
import { FaSnowflake, FaWifi } from "react-icons/fa6";

// Define the available highlights and their icons
const MAIN_HIGHLIGHTS = [
  { id: "Free Wifi", icon: <FaWifi size={22} /> },
  { id: "Swimming Pool", icon: <FaSwimmingPool size={22} /> },
  { id: "Central AC", icon: <FaSnowflake size={22} /> },
  { id: "Free Service", icon: <FaConciergeBell size={22} /> },
  { id: "Gym", icon: <FaDumbbell size={22} /> },
  { id: "Parking", icon: <FaParking size={22} /> },
  { id: "Spa", icon: <FaSpa size={22} /> },
  { id: "Restaurant", icon: <FaUtensils size={22} /> },
];

const Step2 = () => {
  const { control, trigger, watch, setValue } = useFormContext();
  const { previousStep, nextStep } = useWizard();

  const selectedHighlights = watch("highlights") || [];

  const toggleHighlight = (id) => {
    const current = [...selectedHighlights];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue("highlights", current, { shouldValidate: true });
  };

  const handleNext = async () => {
    const isValid = await trigger([
      "amenities",
      "highlights",
      "description",
      "totalFloors",
      "totalRooms",
      "propertyArea",
    ]);
    if (isValid) nextStep();
  };

  return (
    <div className="vstack gap-4">
      <h4 className="mb-0">Detailed Information</h4>

      <Card className="shadow">
        <CardHeader className="border-bottom">
          <h5 className="mb-0">Main Highlights</h5>
        </CardHeader>
        <CardBody>
          <p className="text-muted small mb-3">
            Select the top features to display with icons on your property page.
          </p>
          <div className="d-flex flex-wrap gap-3">
            {MAIN_HIGHLIGHTS.map((item) => {
              const isActive = selectedHighlights.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleHighlight(item.id)}
                  className={`rounded-3 flex-centered cursor-pointer transition-all`}
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: isActive ? "#242b33" : "#f5f7f9",
                    color: isActive ? "#ffffff" : "#676a79",
                    border: isActive
                      ? "2px solid #066ac9"
                      : "2px solid transparent",
                    fontSize: "1.2rem",
                  }}
                  title={item.id}
                >
                  {item.icon}
                </div>
              );
            })}
          </div>
          <Controller
            name="highlights"
            control={control}
            render={({ fieldState: { error } }) =>
              error && (
                <div className="text-danger small mt-2">{error.message}</div>
              )
            }
          />
        </CardBody>
      </Card>

      <Card className="shadow">
        <CardHeader className="border-bottom">
          <h5 className="mb-0">Overview</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-4">
            <Col xs={12}>
              <label className="form-label">Select amenities *</label>
              <Controller
                name="amenities"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <SelectFormInput
                      {...field}
                      className="form-select js-choice border-0 z-index-9 bg-transparent"
                      multiple
                    >
                      {amenities.map((item) => (
                        <option key={item} value={item}>
                          {item}
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
            <Col xs={12}>
              <label className="form-label">Add description *</label>
              <Controller
                name="description"
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
          </Row>
        </CardBody>
      </Card>

      <Card className="shadow">
        <CardHeader className="border-bottom">
          <h5 className="mb-0">Size Of Your Listing</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-4">
            <TextFormInput
              name="totalFloors"
              label="Total Floor *"
              control={control}
              containerClass="col-md-4"
            />
            <TextFormInput
              name="totalRooms"
              label="Total Room *"
              control={control}
              containerClass="col-md-4"
            />
            <TextFormInput
              name="propertyArea"
              label="Room area *"
              control={control}
              containerClass="col-md-4"
            />
          </Row>
        </CardBody>
      </Card>

      <div className="hstack gap-2 flex-wrap justify-content-between">
        <button
          type="button"
          onClick={previousStep}
          className="btn btn-secondary prev-btn mb-0"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="btn btn-primary next-btn mb-0"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
