import { Button, Card, CardBody, CardHeader, Spinner } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { TextFormInput } from "@/components";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../../../states/useAuthContext";
import { API_BASE_URL } from "../../../../config/env";

const UpdateEmail = () => {
  const { user, removeSession } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const emailSchema = yup.object({
    password: yup.string().required("Password is required to verify identity"),
    email: isPasswordVerified
      ? yup.string().email("Invalid email").required("New email is required")
      : yup.string(),
  });

  const { control, handleSubmit, watch, trigger } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const passwordValue = watch("password");
  const token = localStorage.getItem("token");

  const handleVerifyPassword = async () => {
    const isPasswordValid = await trigger("password");
    if (!isPasswordValid) return;

    setLoading(true);
    try {
      // Re-using signin logic concept to verify password
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/auth/verify-current-password`,
        { password: passwordValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsPasswordVerified(true);
        Swal.fire(
          "Verified",
          "Identity verified. You can now enter your new email.",
          "success"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Verification failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const onUpdateEmail = async (data) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/auth/update/email`,
        {
          newEmail: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        await Swal.fire(
          "Success",
          "Email updated. Please log in again.",
          "success"
        );
        removeSession();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border">
      <CardHeader className="border-bottom">
        <h5 className="card-header-title">Update email</h5>
        {user?.email && (
          <p className="mb-0 small">
            Current email: <span className="text-primary">{user.email}</span>
          </p>
        )}
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onUpdateEmail)}>
          <TextFormInput
            name="password"
            type="password"
            label="Enter your current password*"
            placeholder="********"
            control={control}
            disabled={isPasswordVerified || loading}
          />

          {isPasswordVerified && (
            <div className="mt-3">
              <TextFormInput
                name="email"
                label="Enter your new email id*"
                placeholder="newemail@example.com"
                control={control}
              />
            </div>
          )}

          <div className="text-end mt-3">
            {!isPasswordVerified ? (
              <Button
                variant="primary"
                onClick={handleVerifyPassword}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Verify Password"}
              </Button>
            ) : (
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Update Email"}
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default UpdateEmail;
