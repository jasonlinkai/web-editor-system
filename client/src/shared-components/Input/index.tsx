import styles from "./Input.module.scss";

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
    <div className={styles.inputWrap}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
