import styles from "./ImageSelect.module.scss";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";
import { useState } from "react";
import ImageGalleryModal from "@/pages/WebEditor/components/Modals/ImageGalleryModal";

interface ImageSelectProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
}

const ImageSelect = ({
  label = "",
  value = "",
  onChange = (v) => console.log(v),
}: ImageSelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <FormItem>
      {label && <FormItemLabel>{label}</FormItemLabel>}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
        onClick={() => {
          setModalVisible(true);
        }}
      >
        <span className={styles.imageSelectValueSpan}>{value || "-"}</span>
        <ImageGalleryModal
          visible={modalVisible}
          setVisible={setModalVisible}
          onChange={onChange}
        />
      </div>
    </FormItem>
  );
};

export default ImageSelect;
