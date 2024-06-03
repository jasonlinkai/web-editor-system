import styles from "./Input.module.scss";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
}

const Input = ({
  label = "",
  value = "",
  onChange = (v) => console.log(v),
}: InputProps) => {
  return (
    <FormItem>
      {label && <FormItemLabel>{label}</FormItemLabel>}
      <input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormItem>
  );
};

export default Input;
