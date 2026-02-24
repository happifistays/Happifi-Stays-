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
  BsFilePdf,
  BsPeople,
  BsPerson,
  BsShare,
  BsVr,
  BsWallet2,
} from "react-icons/bs";
import { FaCopy, FaLinkedin } from "react-icons/fa6";
import { FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";
import { currency } from "@/states";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config/env";
import axios from "axios";
import confetti from "canvas-confetti";

const ConfirmTicket = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const fireConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 1000,
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: [
          "#26ccff",
          "#a25afd",
          "#ff5e7e",
          "#88ff5a",
          "#fcff42",
          "#ffa62d",
          "#ff36ff",
        ],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: [
          "#26ccff",
          "#a25afd",
          "#ff5e7e",
          "#88ff5a",
          "#fcff42",
          "#ffa62d",
          "#ff36ff",
        ],
      });
    }, 250);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });

    return interval;
  };

  useEffect(() => {
    const timer = fireConfetti();
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/customer/booking/${id}`
        );
        if (res && res.status === 200) {
          setBookingDetails(res.data?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();

    return () => {
      clearInterval(timer);
      confetti.reset();
    };
  }, [id]);

  const downloadPDF = () => {
    if (!bookingDetails) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 150, 255);
    doc.text("Booking Confirmation", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(
      bookingDetails?.propertyId?.listingName || "Hotel Booking",
      105,
      30,
      { align: "center" }
    );
    doc.setFontSize(12);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    const leftCol = 20;
    const rightCol = 110;
    let yPos = 55;
    doc.setFont("helvetica", "bold");
    doc.text("Booking ID:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${bookingDetails?._id || "N/A"}`, leftCol + 35, yPos);
    doc.setFont("helvetica", "bold");
    doc.text("Status:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${bookingDetails?.status?.toUpperCase() || "N/A"}`,
      rightCol + 35,
      yPos
    );
    yPos += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Check-In:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      bookingDetails?.checkInDate
        ? format(new Date(bookingDetails.checkInDate), "dd MMM yyyy")
        : "N/A",
      leftCol + 35,
      yPos
    );
    doc.setFont("helvetica", "bold");
    doc.text("Check-Out:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      bookingDetails?.checkOutDate
        ? format(new Date(bookingDetails.checkOutDate), "dd MMM yyyy")
        : "N/A",
      rightCol + 35,
      yPos
    );
    yPos += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Guest Name:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${bookingDetails?.bookedUserId?.name || "N/A"}`,
      leftCol + 35,
      yPos
    );
    doc.setFont("helvetica", "bold");
    doc.text("Guests:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${bookingDetails?.guestCount || 0}`, rightCol + 35, yPos);
    yPos += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${bookingDetails?.bookedUserId?.email || "N/A"}`,
      leftCol + 35,
      yPos
    );
    doc.setFont("helvetica", "bold");
    doc.text("Contact:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${bookingDetails?.bookedUserId?.contactNumber || "N/A"}`,
      rightCol + 35,
      yPos
    );
    yPos += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Payment:", leftCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${
        bookingDetails?.paymentStatus === "pay_at_hotel"
          ? "Pay at Hotel"
          : "Paid Online"
      }`,
      leftCol + 35,
      yPos
    );
    doc.setFont("helvetica", "bold");
    doc.text("Method:", rightCol, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${bookingDetails?.paymentType || "N/A"}`, rightCol + 35, yPos);
    yPos += 20;
    doc.setDrawColor(0, 150, 255);
    doc.rect(15, yPos - 10, 180, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Amount: ${currency}${bookingDetails?.totalAmount || 0}`,
      105,
      yPos + 3,
      { align: "center" }
    );
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Thank you for booking with " + bookingDetails?.propertyId?.listingName,
      105,
      yPos + 30,
      { align: "center" }
    );
    doc.save(`Booking_${bookingDetails?._id}.pdf`);
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <section className="pt-4">
      <Container>
        <Row>
          <Col md={10} xl={8} className="mx-auto">
            <Card className="shadow">
              {bookingDetails?.propertyId?.thumbnail && (
                <Image
                  src={bookingDetails.propertyId.thumbnail}
                  className="rounded-top"
                />
              )}
              <CardBody className="text-center p-4">
                <h1 className="card-title fs-3">🎊 Congratulations! 🎊</h1>
                <p className="lead mb-3">Your Room has been booked</p>
                <h5 className="text-primary mb-4">
                  {bookingDetails?.propertyId?.listingName}
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
                          {bookingDetails?._id ?? ""}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsPerson className=" fa-fw me-2" />
                          Booked by:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingDetails?.bookedUserId?.name}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsWallet2 className=" fa-fw me-2" />
                          Payment Method:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingDetails?.paymentStatus === "pay_at_hotel"
                            ? "Pay at Hotel"
                            : "Online Payment"}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">Total Price:</span>
                        <span className="h6 fw-normal mb-0">
                          {currency}
                          {bookingDetails?.totalAmount}
                        </span>
                      </li>
                    </ul>
                  </Col>
                  <Col lg={5}>
                    <ul className="list-group list-group-borderless">
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsCalendar className=" fa-fw me-2" />
                          Check-In:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingDetails?.checkInDate &&
                            format(
                              new Date(bookingDetails.checkInDate),
                              "dd MMM yyyy"
                            )}
                        </span>
                      </li>
                      <li className="list-group-item d-sm-flex justify-content-between align-items-center">
                        <span className="mb-0 items-center">
                          <BsCalendar className=" fa-fw me-2" />
                          Check-Out:
                        </span>
                        <span className="h6 fw-normal mb-0">
                          {bookingDetails?.checkOutDate &&
                            format(
                              new Date(bookingDetails.checkOutDate),
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
                          {bookingDetails?.guestCount || 0}
                        </span>
                      </li>
                    </ul>
                  </Col>
                </Row>
                <div className="d-sm-flex justify-content-sm-end d-grid">
                  <Dropdown className="me-sm-2 mb-2 mb-sm-0">
                    <DropdownToggle
                      as="button"
                      type="button"
                      className="arrow-none btn btn-light mb-0 w-100 items-center"
                      role="button"
                    >
                      <BsShare className=" me-2" />
                      Share
                    </DropdownToggle>
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
