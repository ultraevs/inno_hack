import React, { FC, useState } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";
import { useOutsideClick } from "@/utils/hooks/useOutsideClick";
import { getBgByField } from "@/utils/helper";

interface IProps {
  readonly index: number;
  readonly name: string;
  readonly value: string;
  readonly placeholder: string;
  readonly items: string[];
  readonly setValue: any;
  readonly isUsernames?: boolean;
}

const SelectForm: FC<IProps> = (props) => {
  const {
    index,
    name,
    value,
    placeholder,
    items,
    setValue,
    isUsernames = false,
  } = props;

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const dropdownRef = useOutsideClick({ callback: closeDropdown });

  const handleItemClick = (item: string) => {
    setValue(index, name, item);
    closeDropdown();
  };

  return (
    <div className={styles.select}>
      <div className={styles.select__static} onClick={openDropdown}>
        {isUsernames ? (
          <input
            type="text"
            value={value !== "" ? value : placeholder}
            readOnly
          />
        ) : value !== "" ? (
          <div
            className={styles.select__static__status}
            style={{ background: getBgByField(value)[1] }}
          >
            <div style={{ background: getBgByField(value)[0] }}></div>
            {value}
          </div>
        ) : (
          <div>{placeholder}</div>
        )}
      </div>
      <ul
        ref={dropdownRef}
        className={cn(styles.select__dropdown, isDropdownOpen && styles.open)}
      >
        {items.map((el, index) =>
          isUsernames ? (
            <li
              className={styles.select__dropdown__username}
              key={index}
              onClick={() => handleItemClick(el)}
            >
              {el}
            </li>
          ) : (
            <li
              className={styles.select__dropdown__status}
              key={index}
              onClick={() => handleItemClick(el)}
            >
              <div></div>
              {el}
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export { SelectForm };
