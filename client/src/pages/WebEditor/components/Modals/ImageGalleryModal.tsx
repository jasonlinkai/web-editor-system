import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import Dialog, { DialogRefType } from "@/shared-components/Dialog";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { makeOptions } from "@/libs/utils";
import { AttributesEnum } from "@/libs/types";

const ImageGalleryModal = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const { displayImages, selectedAstNode } = editor;
  const { isImageGalleryModalVisible, setIsImageGalleryModalVisible } = editor;
  const dialogRef = useRef<DialogRefType>(null);

  useEffect(() => {
    if (isImageGalleryModalVisible) {
      dialogRef.current?.openDialog();
    } else {
      dialogRef.current?.closeDialog();
    }
  }, [isImageGalleryModalVisible]);

  return (
    <Dialog
      ref={dialogRef}
      onClose={() => {
        setIsImageGalleryModalVisible(false);
      }}
    >
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {makeOptions(displayImages).map((item) => (
          <ImageListItem
            style={{
              cursor: 'pointer',
            }}
            key={item.value}
            onClick={() => {
              selectedAstNode?.updateAttributes({
                key: AttributesEnum.src,
                value: item.value,
              });
              setIsImageGalleryModalVisible(false);
            }}
          >
            <img src={`${item.value}`} alt={item.label} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </Dialog>
  );
});

export default ImageGalleryModal;
