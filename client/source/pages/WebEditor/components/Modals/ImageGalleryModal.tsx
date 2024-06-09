"use client";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import Dialog, { DialogRefType } from "source/editor-components/Dialog";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { makeOptions } from "source/libs/utils";
import { MdClose } from "react-icons/md";

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
        <ImageList sx={{ width: 500, height: 500 }} cols={5} rowHeight={100}>
          <ImageListItem
            style={{
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onChange && onChange("");
              setVisible(false);
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid grey`
              }}
            >
              <MdClose />
            </div>
          </ImageListItem>
          {makeOptions(displayImages).map((item) => {
            return (
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
            );
          })}
        </ImageList>
      </Dialog>
    );
  }
);

export default ImageGalleryModal;
