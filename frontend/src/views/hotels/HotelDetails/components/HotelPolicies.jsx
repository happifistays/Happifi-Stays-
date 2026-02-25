import { Card, CardBody, CardHeader } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";

const policies = [
  "Check-in: 1:00 pm - 9:00 pm",
  "Check out: 11:00 am",
  "Self-check-in with building staff",
  "No pets",
  "No parties or events",
  "Smoking is allowed",
];

const HotelPolicies = ({ policy }) => {
  return (
    <Card className="bg-transparent">
      <CardHeader className="border-bottom bg-transparent px-0 pt-0">
        <h3 className="mb-0">Hotel Policies</h3>
      </CardHeader>
      <CardBody className="pt-4 p-0">
        {/* Render the HTML string here */}
        <div
          className="rich-text-container mb-4"
          dangerouslySetInnerHTML={{ __html: policy }}
        />

        {/* <ul className="list-group list-group-borderless mb-2">
          {policies.map((item, idx) => {
            return (
              <li
                key={idx}
                className="list-group-item h6 fw-light mb-0 d-flex align-items-center"
              >
                <BsArrowRight className=" me-2" />
                {item}
              </li>
            );
          })}
        </ul> */}
      </CardBody>
    </Card>
  );
};

export default HotelPolicies;
