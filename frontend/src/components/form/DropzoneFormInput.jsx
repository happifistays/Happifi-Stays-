import { useFileUploader } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { Col, FormLabel, FormText } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { BsUpload } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

const DropzoneFormInput = ({ label, onFileUpload, value, showPreview }) => {
  const { selectedFiles, handleAcceptedFiles, removeFile, setSelectedFiles } =
    useFileUploader(showPreview);

  const [errorMessage, setErrorMessage] = useState("");
  const isInitialized = useRef(false);
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    if (
      value &&
      Array.isArray(value) &&
      value.length > 0 &&
      !isInitialized.current
    ) {
      const formattedFiles = value.map((file) => {
        if (typeof file === "string") {
          return { preview: file, base64: file, name: "Existing Image" };
        }
        return file;
      });
      setSelectedFiles(formattedFiles);
      isInitialized.current = true;
    }
  }, [value, setSelectedFiles]);

  useEffect(() => {
    if (isInitialized.current || selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  }, [selectedFiles, onFileUpload]);

  return (
    <div>
      {label && <FormLabel>{label}</FormLabel>}
      <Dropzone
        accept={{ "image/*": [] }}
        maxSize={MAX_SIZE}
        onDrop={(files) => {
          setErrorMessage("");
          isInitialized.current = true;
          handleAcceptedFiles(files);
        }}
        onDropRejected={(fileRejections) => {
          if (
            fileRejections.some((rejection) => rejection.file.size > MAX_SIZE)
          ) {
            setErrorMessage("One or more images exceed the 5MB limit.");
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone dropzone-custom">
            <div className="dz-message" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="mb-3">
                <BsUpload size={30} />
              </div>
              <p>Drop files here or click to upload.</p>
              <small className="text-muted">Maximum file size: 5MB</small>
            </div>
            {errorMessage && (
              <FormText className="text-danger d-block mt-2 text-center">
                {errorMessage}
              </FormText>
            )}
            {showPreview && selectedFiles.length > 0 && (
              <div className="dz-preview row g-4 mt-2">
                {selectedFiles.map((file, idx) => (
                  <Col xl={2} md={4} sm={6} key={idx}>
                    <div className="card p-2 shadow-none border position-relative h-100">
                      <img
                        src={file.preview || file}
                        alt="preview"
                        className="rounded img-fluid"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0"
                        style={{ width: "20px", height: "20px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file);
                        }}
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  </Col>
                ))}
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default DropzoneFormInput;
