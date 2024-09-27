import { FC, useState } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";
import { FieldProps } from "formik";
import { useOutsideClick } from "@/utils/hooks/useOutsideClick";
import { CaretDownOutlined } from "@ant-design/icons";

interface IProps {
  readonly placeholder: string;
  readonly dropdownItems: string[];
  readonly className?: string;
}

const SelectCustomField: FC<FieldProps & IProps> = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const { placeholder, dropdownItems, className } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const dropdownRef = useOutsideClick({ callback: closeDropdown });

  const handleItemClick = (item: string) => {
    setFieldValue(field.name, item);
    closeDropdown();
  };

  return (
    <div className={styles.select}>
      <div className={styles.select__static} onClick={openDropdown}>
        <input
          type="text"
          value={field.value}
          placeholder={placeholder}
          readOnly
        />
        <CaretDownOutlined />
      </div>
      <div
        ref={dropdownRef}
        className={cn(styles.select__dropdown, isDropdownOpen && styles.open)}
      >
        <div className={styles.select__dropdown__items}>
          <ul>
            {dropdownItems.map((item) => (
              <li key={item} onClick={() => handleItemClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { SelectCustomField };
