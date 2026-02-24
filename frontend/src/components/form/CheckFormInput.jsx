import { FormCheck, FormText } from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import { Controller } from "react-hook-form";

const CheckFormInput = ({
  name,
  containerClass,
  control,
  helpText,
  id,
  label,
  noValidate,
  labelClassName,
  ...other
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // For radio buttons, we must explicitly set the checked attribute
        const isChecked = field.value === other.value;

        return (
          <FormCheck
            className={containerClass ?? ""}
            id={`form-check-${id ?? name}`}
          >
            <FormCheckInput
              {...other}
              onChange={() => field.onChange(other.value)}
              onBlur={field.onBlur}
              name={field.name}
              checked={isChecked}
              isInvalid={Boolean(fieldState.error?.message)}
            />
            {label && (
              <FormCheckLabel className={labelClassName}>
                {label}
              </FormCheckLabel>
            )}
            {helpText && <FormText id={`${id}-help`}>{helpText}</FormText>}
            {!noValidate && fieldState.error?.message && (
              <Feedback type="invalid">{fieldState.error?.message}</Feedback>
            )}
          </FormCheck>
        );
      }}
    />
  );
};

export default CheckFormInput;
