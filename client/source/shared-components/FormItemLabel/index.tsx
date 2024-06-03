import styles from "./FormItemLabel.module.scss";

interface FormItemLabelProps extends React.PropsWithChildren {
}

const FormItemLabel = ({ children }: FormItemLabelProps) => {
  return <label className={styles.formItemLabel}>{children}</label>;
};

export default FormItemLabel;
