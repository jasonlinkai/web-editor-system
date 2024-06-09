"use client";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import Dialog, { DialogRefType } from "source/editor-components/Dialog";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { makeOptions } from "source/libs/utils";

const ImageGalleryModal = observer(
  ({
    visible,
    setVisible,
    onChange,
  }: {
    visible: boolean;
    setVisible: (v: boolean) => void;
    onChange: (v: string) => void;
  }) => {
    const { selectedPage } = useStores();
    if (!selectedPage) return null;
    const { editor } = selectedPage;
    const { displayImages } = editor;
    const dialogRef = useRef<DialogRefType>(null);

    useEffect(() => {
      if (visible) {
        dialogRef.current?.openDialog();
      } else {
        dialogRef.current?.closeDialog();
      }
    }, [visible]);

    return (
      <Dialog
        ref={dialogRef}
        onClose={() => {
          setVisible(false);
        }}
      >
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {makeOptions(displayImages).map((item) => (
            <ImageListItem
              style={{
                cursor: "pointer",
              }}
              key={item.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange && onChange(item.value);
                setVisible(false);
              }}
            >
              <img src={`${item.value}`} alt={item.label} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      </Dialog>
    );
  }
);

export default ImageGalleryModal;
