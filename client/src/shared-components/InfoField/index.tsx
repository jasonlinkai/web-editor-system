import styles from "./InfoField.module.scss";

interface InfoFieldProps {
  label?: string;
  value?: string;
}

const InfoField = ({
  label = "",
  value = "",
}: InfoFieldProps) => {
  return (
    <div className={styles.infoFieldWrap}>
      <label className={styles.infoFieldLabel}>{label}</label>
      <span
        className={styles.infoField}
      >{value || '-'}</span>
    </div>
  );
};

export default InfoField;
