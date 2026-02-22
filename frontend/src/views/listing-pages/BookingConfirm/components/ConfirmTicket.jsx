import {
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Image,
  Row,
} from "react-bootstrap";
import {
  BsCalendar,
  BsCurrencyDollar,
  BsFilePdf,
  BsPeople,
  BsPerson,
  BsShare,
  BsVr,
  BsWallet2,
} from "react-icons/bs";
import { FaCopy, FaLinkedin } from "react-icons/fa6";
import { FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";
import gallery4 from "@/assets/images/gallery/04.jpg";
import { currency } from "@/states";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

const ConfirmTicket = ({ bookingData }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 150, 255);
    doc.text("Booking Confirmation", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Congratulations! Your Room has been booked", 105, 30, {
      align: "center",
    });

    // Content
    doc.setFontSize(12);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    const leftCol = 20;
    const rightCol = 110;
    let yPos = 55;

    // Booking Details
    doc.setFont("helvetica", "bold");
    doc.text("Booking ID:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${bookingData?.booking?._id || "N/A"}`, leftCol + 30, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Date:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      bookingData?.booking?.checkInDate
        ? format(new Date(bookingData.booking.checkInDate), "dd MMM yyyy")
        : "N/A",
      rightCol + 35,
      yPos
    );

    yPos += 15;

    doc.setFont("helvetica", "bold");
    doc.text("Booked by:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${bookingData?.bookedUser?.name || "N/A"}`, leftCol + 30, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Check-out:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      bookingData?.booking?.checkOutDate
        ? format(new Date(bookingData.booking.checkOutDate), "dd MMM yyyy")
        : "N/A",
      rightCol + 35,
      yPos
    );

    yPos += 15;

    doc.setFont("helvetica", "bold");
    doc.text("Payment:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${bookingData?.booking?.paymentType || "N/A"}`,
      leftCol + 30,
      yPos
    );

    doc.setFont("helvetica", "bold");
    doc.text("Guests:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${bookingData?.guests?.length || 0}`, rightCol + 35, yPos);

    yPos += 20;
    doc.setDrawColor(0, 150, 255);
    doc.rect(15, yPos - 10, 180, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Price: ${currency}${bookingData?.booking?.totalAmount || 0}`,
      105,
      yPos + 3,
      { align: "center" }
    );

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing our service!", 105, 120, {
      align: "center",
    });

    doc.save(`Booking_${bookingData?.booking?._id}.pdf`);
  };

  return (
    <section className="pt-4">
      <Container>
        <Row>
          <Col md={10} xl={8} className="mx-auto">
            <Card className="shadow">
              <Image src={gallery4} className="rounded-top" />
              <CardBody className="text-center p-4">
                <h1 className="card-title fs-3">🎊 Congratulations! 🎊</h1>
                <p className="lead mb-3">Your Room has been booked</p>
                <h5 className="text-primary mb-4">
                  Beautiful Bali with Malaysia
                </h5>
                <Row className="justify-content-between text-start mb-4">
                  <Col lg={5}>
                    <ul className="list-group list-group-borderless">
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsVr className=" fa-fw me-2" />
                          Booking ID:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingData?.booking?._id}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsPerson className=" fa-fw me-2" />
                          Booked by:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingData?.bookedUser?.name}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsWallet2 className=" fa-fw me-2" />
                          Payment Method:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingData?.booking?.paymentType}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">Total Price:</span>
                        <span className="h6 fw-normal mb-0">
                          {currency}
                          {bookingData?.booking?.totalAmount}
                        </span>
                      </li>
                    </ul>
                  </Col>
                  <Col lg={5}>
                    <ul className="list-group list-group-borderless">
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsCalendar className=" fa-fw me-2" />
                          Date:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingData?.booking?.checkInDate &&
                            format(
                              new Date(bookingData.booking.checkInDate),
                              "dd MMM yyyy"
                            )}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsCalendar className=" fa-fw me-2" />
                          Tour Date:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingData?.booking?.checkOutDate &&
                            format(
                              new Date(bookingData.booking.checkOutDate),
                              "dd MMM yyyy"
                            )}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsPeople className=" fa-fw me-2" />
                          Guests:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingData?.guests?.length || 0}
                        </span>
                      </li>
                    </ul>
                  </Col>
                </Row>
                <div className="d-sm-flex justify-content-sm-end d-grid">
                  <Dropdown className="me-sm-2 mb-2 mb-sm-0">
                    {/* <DropdownToggle
                      as="button"
                      type="button"
                      className="arrow-none btn btn-light mb-0 w-100 items-center"
                      role="button"
                    >
                      <BsShare className=" me-2" />
                      Share
                    </DropdownToggle> */}
                    <DropdownMenu
                      align="end"
                      className="min-w-auto shadow rounded"
                    >
                      <DropdownItem className="items-center">
                        <FaTwitterSquare className="me-2" />
                        Twitter
                      </DropdownItem>

                      <DropdownItem className="items-center">
                        <FaFacebookSquare className="me-2" />
                        Facebook
                      </DropdownItem>

                      <DropdownItem className="items-center">
                        <FaLinkedin className="me-2" />
                        LinkedIn
                      </DropdownItem>

                      <DropdownItem className="items-center">
                        <FaCopy className="me-2" />
                        Copy link
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <button
                    onClick={downloadPDF}
                    className="btn btn-primary mb-0 items-center"
                  >
                    <BsFilePdf className=" me-2" />
                    Download PDF
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ConfirmTicket;
