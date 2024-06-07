import styles from "./InfoField.module.scss";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";

interface InfoFieldProps {
  label?: string;
  value?: string;
}

const InfoField = ({ label = "", value = "" }: InfoFieldProps) => {
  return (
    <FormItem>
      <FormItemLabel>{label}</FormItemLabel>
      <span className={styles.infoField}>{value || "-"}</span>
    </FormItem>
  );
};

export default InfoField;
