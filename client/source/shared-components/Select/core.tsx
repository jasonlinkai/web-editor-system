import { ChangeEventHandler } from "react";
import styles from "./Select.module.scss";
import { IoMdArrowDropdown } from "react-icons/io";

interface CoreSelectProps {
  label?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>,
  options?: { label: string; value: string }[];
}

const CoreSelect = ({
  label = "",
  value = "",
  onChange = (v) => console.log(v),
  options = [],
}: CoreSelectProps) => {
  return (
    <div className={styles.coreSelectWrap}>
      <select
        className={styles.coreSelect}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      <IoMdArrowDropdown className={styles.coreSelectRightIcon} />
    </div>
  );
};

export default CoreSelect;
