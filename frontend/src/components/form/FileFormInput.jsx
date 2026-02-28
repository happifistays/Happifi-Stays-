import { Controller, useFormContext } from "react-hook-form";
import { FormLabel, FormControl, FormText } from "react-bootstrap";
import { useState } from "react";

const FileFormInput = ({ name, control, label, containerClass }) => {
  // Safe access to context to prevent "null" destructuring error
  const methods = useFormContext();
  const [localError, setLocalError] = useState("");

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  return (
    <div className={containerClass}>
      {label && <FormLabel>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <FormControl
              type="file"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > MAX_SIZE) {
                    const errorMsg = "Image should be less than 5MB";
                    setLocalError(errorMsg);

                    // Only call setError if FormProvider exists
                    if (methods) {
                      methods.setError(name, {
                        type: "manual",
                        message: errorMsg,
                      });
                    }
                    return;
                  }

                  setLocalError("");
                  if (methods) {
                    methods.clearErrors(name);
                  }

                  const base64 = await toBase64(file);
                  onChange({ base64, name: file.name });
                }
              }}
              isInvalid={!!error || !!localError}
            />
            {value && (
              <div className="mt-2">
                <img
                  src={typeof value === "string" ? value : value.base64}
                  alt="Preview"
                  style={{ height: "80px", width: "80px", objectFit: "cover" }}
                  className="rounded border"
                />
              </div>
            )}
            {(error || localError) && (
              <FormText className="text-danger">
                {error?.message || localError}
              </FormText>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default FileFormInput;
