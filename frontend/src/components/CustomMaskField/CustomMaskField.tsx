import { FC } from "react";
import { FieldProps } from "formik";
import InputMask from "react-input-mask";

const CustomMaskField: FC<FieldProps> = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const handleChange = (event: any) => {
    field.onChange(event);
  };

  return (
    <InputMask
      name={field.name}
      value={field.value}
      maskChar={null}
      mask={"9999-99-99 99:99"}
      onChange={handleChange}
      placeholder="ГГГГ-ММ-ДД ЧЧ:ММ"
    />
  );
};

export { CustomMaskField };
