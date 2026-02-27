import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Modal,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import clsx from "clsx";
import { BsBookmarkHeart, BsThreeDotsVertical } from "react-icons/bs";
import {
  FaSearch,
  FaEye,
  FaRegEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import NotFound from "../../../components/NotFound/NotFound";
import { API_BASE_URL } from "../../../config/env";
import { PageMetaData, SelectFormInput } from "@/components";

const AgentContacts = () => {
  const [loading, setLoading] = useState(false);
  const [totalContact, setTotalContact] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);

  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const fetchContacts = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/contacts?page=${page}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (data && data.success) {
        setContacts(data.data);
        setTotalContact(data.total);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(currentPage);
  }, [fetchContacts, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "??";
  };

  const renderPagination = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <li
          key={i}
          className={clsx("page-item", { active: i === currentPage })}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return items;
  };

  const startEntry = contacts.length > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endEntry = Math.min(currentPage * 10, totalContact);

  if (!loading && contacts.length === 0) {
    return (
      <NotFound
        title={"No Leads found!"}
        description={"You dont have any leads yet!"}
      />
    );
  }

  return (
    <>
      <PageMetaData title="Agent Contacts" />
      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <div className="d-flex align-items-center justify-content-between">
                <h1 className="fs-4 mb-0 d-flex align-items-center gap-2">
                  <div className="icon-md bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center">
                    <BsBookmarkHeart size={20} />
                  </div>
                  Inquiries & Contacts
                </h1>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card className="border shadow-sm overflow-hidden">
                <CardHeader className="bg-light border-bottom p-3">
                  <div className="d-sm-flex align-items-center justify-content-between">
                    <h5 className="card-header-title mb-0">Contact List</h5>
                    <Badge bg="primary" className="rounded-pill">
                      {totalContact} Submissions
                    </Badge>
                  </div>
                </CardHeader>

                <CardBody className="p-0">
                  <div className="p-3 border-bottom">
                    <Row className="g-3">
                      <Col md={8}>
                        <div className="position-relative">
                          <input
                            className="form-control bg-light border-0 pe-5"
                            type="search"
                            placeholder="Search by name or email..."
                          />
                          <button
                            className="btn position-absolute top-50 end-0 translate-middle-y text-primary"
                            type="button"
                          >
                            <FaSearch />
                          </button>
                        </div>
                      </Col>
                      <Col md={4}>
                        <SelectFormInput className="form-select bg-light border-0">
                          <option value={-1}>Sort by Date</option>
                          <option>Newest First</option>
                          <option>Oldest First</option>
                        </SelectFormInput>
                      </Col>
                    </Row>
                  </div>

                  <div className="table-responsive border-0">
                    <table className="table align-middle table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4 border-0">User</th>
                          <th className="border-0">Contact Info</th>
                          <th className="border-0">Preview Message</th>
                          <th className="border-0">Date</th>
                          <th className="border-0 text-end pe-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="text-center py-5">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              ></div>
                            </td>
                          </tr>
                        ) : (
                          contacts.map((contact, idx) => (
                            <tr key={contact._id || idx}>
                              <td className="ps-4">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                                    style={{ width: "40px", height: "40px" }}
                                  >
                                    {getInitials(contact.name)}
                                  </div>
                                  <h6 className="mb-0">{contact?.name}</h6>
                                </div>
                              </td>
                              <td>
                                <div className="small mb-1">
                                  <FaRegEnvelope className="me-1" />{" "}
                                  {contact?.email}
                                </div>
                                <div className="small">
                                  <FaPhoneAlt className="me-1" size={10} />{" "}
                                  {contact?.phone}
                                </div>
                              </td>
                              <td>
                                <p
                                  className="mb-0 small text-truncate"
                                  style={{ maxWidth: "250px" }}
                                >
                                  {contact?.message}
                                </p>
                              </td>
                              <td>
                                <span className="small">
                                  {contact.createdAt
                                    ? new Date(
                                        contact.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </td>
                              <td className="text-end pe-4">
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="btn-round mb-0"
                                  onClick={() => handleView(contact)}
                                >
                                  <FaEye className="text-primary" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>

                <CardFooter className="bg-light border-top p-3">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-sm-0 text-muted small">
                      Showing{" "}
                      <strong>
                        {startEntry}-{endEntry}
                      </strong>{" "}
                      of {totalContact}
                    </p>
                    <nav className="mb-sm-0">
                      <ul className="pagination pagination-sm pagination-primary-soft mb-0">
                        <li
                          className={clsx("page-item", {
                            disabled: currentPage === 1,
                          })}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            Prev
                          </button>
                        </li>
                        {renderPagination()}
                        <li
                          className={clsx("page-item", {
                            disabled: currentPage === totalPages,
                          })}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        className="contact-detail-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body className="px-4 pb-5 pt-0">
          {selectedContact && (
            <>
              <div className="text-center mb-5">
                <div className="position-relative d-inline-block mb-3">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "100px", height: "100px" }}
                  >
                    <FiUser size={50} className="text-primary" />
                  </div>
                  <Badge
                    bg="success"
                    className="position-absolute bottom-0 end-0 rounded-circle p-2 border border-white border-3"
                  >
                    <span className="visually-hidden">Online</span>
                  </Badge>
                </div>
                <h3 className="fw-bold mb-1">{selectedContact.name}</h3>
                <p className="text-muted">
                  <FaCalendarAlt className="me-2" />
                  Received on{" "}
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>

                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button
                    variant="primary"
                    className="rounded-pill px-4 shadow-sm"
                    href={`mailto:${selectedContact.email}`}
                  >
                    <FaRegEnvelope className="me-2" /> Reply via Email
                  </Button>
                  <Button
                    variant="outline-dark"
                    className="rounded-pill px-4"
                    href={`tel:${selectedContact.phone}`}
                  >
                    <FaPhoneAlt className="me-2" /> Call Now
                  </Button>
                </div>
              </div>

              <Row className="g-4">
                <Col md={12}>
                  <div className="p-4 bg-light rounded-4 position-relative">
                    <FaQuoteLeft
                      className="position-absolute top-0 start-0 translate-middle text-primary opacity-25"
                      size={40}
                    />
                    <h6 className="text-uppercase text-primary fw-bold small mb-3">
                      Client Message
                    </h6>
                    <p
                      className="fs-5 text-dark mb-0 lh-base"
                      style={{ whiteSpace: "pre-wrap", fontStyle: "italic" }}
                    >
                      "{selectedContact.message}"
                    </p>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border rounded-4 p-3 d-flex align-items-center shadow-sm h-100">
                    <div className="icon-md bg-info bg-opacity-10 text-info rounded-3 me-3">
                      <FaRegEnvelope size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">
                        Primary Email
                      </small>
                      <span className="fw-bold">{selectedContact.email}</span>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border rounded-4 p-3 d-flex align-items-center shadow-sm h-100">
                    <div className="icon-md bg-success bg-opacity-10 text-success rounded-3 me-3">
                      <FaPhoneAlt size={20} />
                    </div>
                    <div>
                      <small className="text-muted d-block">Phone Number</small>
                      <span className="fw-bold">{selectedContact.phone}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        .icon-md { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .avatar-sm { font-size: 0.85rem; }
        .contact-detail-modal .modal-content { border-radius: 1.5rem; border: none; box-shadow: 0 1rem 3rem rgba(0,0,0,0.175); }
        .bg-opacity-10 { --bs-bg-opacity: 0.1; }
      `}</style>
    </>
  );
};

export default AgentContacts;
