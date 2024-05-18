import styles from "./Select.module.scss";
import { IoMdArrowDropdown } from "react-icons/io";
interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  options?: { label: string; value: string }[];
}

const Select = ({
  label = "",
  value = "",
  onChange = (v) => console.log(v),
  options = [],
}: SelectProps) => {
  return (
    <div className={styles.selectWrap}>
      {label && <label className={styles.selectLabel}>{label}</label>}
      <select
        className={styles.select}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      <IoMdArrowDropdown className={styles.selectRightIcon} />
    </div>
  );
};

export default Select;
