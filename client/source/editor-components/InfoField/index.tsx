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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: "1",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        <span className={styles.infoField}>{value || "-"}</span>
      </div>
    </FormItem>
  );
};

export default InfoField;
