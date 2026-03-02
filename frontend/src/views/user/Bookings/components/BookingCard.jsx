import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Dropdown,
} from "react-bootstrap";
import { FaHotel, FaDownload } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { format, differenceInHours } from "date-fns";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../../../../config/env";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const BookingCard = ({ booking, showActions = false, onSuccess }) => {
  console.log("booking-----------", booking);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.text("BOOKINGS REPORT", 14, 20);

    // Meta Information
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(
      `Generated on: ${format(new Date(), "M/dd/yyyy, h:mm:ss a")}`,
      14,
      30
    );
    doc.text("Total Bookings: 1", 14, 38);

    // Table Data
    const tableColumn = [
      "#",
      "Room Name",
      "Duration",
      "Status",
      "Payment",
      "Amount",
    ];
    const tableRows = [
      [
        1,
        booking?.propertyId?.listingName ?? "N/A",
        `${
          booking?.checkInDate
            ? format(new Date(booking.checkInDate), "dd MMM yyyy")
            : ""
        } to ${
          booking?.checkOutDate
            ? format(new Date(booking.checkOutDate), "dd MMM yyyy")
            : ""
        }`,
        booking?.status?.toUpperCase() ?? "",
        booking?.paymentStatus?.toUpperCase() ?? "",
        `INR ${booking?.totalAmount ?? 0}`,
      ],
    ];

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [13, 110, 253], // Bootstrap blue
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      margin: { top: 45 },
    });

    doc.save(`booking_report_${booking?.bookingId || "id"}.pdf`);
  };

  const handleCancel = async () => {
    const checkIn = new Date(booking.checkInDate);
    const now = new Date();
    const hoursDifference = differenceInHours(checkIn, now);

    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.patch(
            `${API_BASE_URL}/api/v1/customer/booking/cancel/${booking._id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(
            `Request failed: ${error.response?.data?.message || error.message}`
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        Swal.fire(
          "Cancelled!",
          "Your booking has been cancelled.",
          "success"
        ).then(() => {
          if (onSuccess) onSuccess();
        });
      }
    });
  };

  return (
    <Card className="border mb-4">
      <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="icon-lg bg-light rounded-circle flex-shrink-0">
            <FaHotel />
          </div>

          <div className="ms-2">
            <h6 className="card-title mb-0">
              {booking?.propertyId?.listingName ?? ""}
            </h6>
            <ul className="nav nav-divider small">
              {/* <li className="nav-item">Booking ID: {booking?._id ?? ""}</li> */}
              <li className="nav-item">{booking?.paymentStatus}</li>
            </ul>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <Button
            variant="light"
            className="btn-round mb-0 me-2"
            onClick={generatePDF}
            title="Download PDF"
          >
            <FaDownload />
          </Button>

          {showActions && (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="a"
                className="btn btn-light btn-round mb-0 arrow-none"
              >
                <BsThreeDotsVertical />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-end min-w-auto shadow">
                <li>
                  <Dropdown.Item className="text-danger" onClick={handleCancel}>
                    Cancel booking
                  </Dropdown.Item>
                </li>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </CardHeader>

      <CardBody>
        <Row className="g-3">
          <Col sm={6} md={4}>
            <span>Booking ID:</span>
            <h6 className="mb-0">100{booking?.bookingId ?? ""}</h6>
          </Col>

          <Col sm={6} md={4}>
            <span>Check in Date</span>
            <h6 className="mb-0">
              {booking?.checkInDate
                ? format(new Date(booking.checkInDate), "dd MMM yyyy")
                : ""}
            </h6>
          </Col>
          <Col sm={6} md={4}>
            <span>Check out Date</span>
            <h6 className="mb-0">
              {booking?.checkOutDate
                ? format(new Date(booking.checkOutDate), "dd MMM yyyy")
                : ""}
            </h6>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BookingCard;
