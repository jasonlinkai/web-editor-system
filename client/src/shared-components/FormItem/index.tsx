import styles from "./FormItem.module.scss";

const FormItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className={styles.formItem}>{children}</div>;
};

export default FormItem;
