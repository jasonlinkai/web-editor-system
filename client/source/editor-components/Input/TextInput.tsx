import styles from "./Input.module.scss";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";

interface TextInputProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
}

const TextInput = ({
  label = "",
  value = "",
  onChange = (v) => console.log(v),
}: TextInputProps) => {
  return (
    <FormItem>
      {label && <FormItemLabel>{label}</FormItemLabel>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: "1",
          justifyContent: "flex-end",
        }}
      >
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </FormItem>
  );
};

export default TextInput;
