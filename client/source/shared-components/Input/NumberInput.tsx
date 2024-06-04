import styles from "./Input.module.scss";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";
import { TextField } from "@mui/material";

interface NumberInputProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
}

const NumberInput = ({
  label = "",
  value = "",
  onChange = (v) => console.log(v),
}: NumberInputProps) => {
  return (
    <FormItem>
      {label && <FormItemLabel>{label}</FormItemLabel>}
      <TextField
        type="number"
        className={styles.input}
        value={value.replace("px", "")}
        onChange={(e) => {
          onChange(`${e.target.value}px`);
        }}
      />
    </FormItem>
  );
};

export default NumberInput;
