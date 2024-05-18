import { MdClose } from "react-icons/md";
import styles from "./Dialog.module.scss"; // Import CSS file for styling
import React, {
  useState,
  useImperativeHandle,
  useRef,
  useCallback,
  forwardRef,
  useEffect,
} from "react";
import { Backdrop } from "@mui/material";

export interface DialogRefType {
  openDialog: () => void;
  closeDialog: () => void;
}

export interface DialogProps extends React.PropsWithChildren {
  onClose?: () => void;
}

const Dailog = forwardRef<DialogRefType, DialogProps>(
  ({ children, onClose }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = useCallback(() => {
      setIsOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
      onClose && onClose();
      setIsOpen(false);
    }, [onClose]);

    useImperativeHandle(
      ref,
      () => {
        return {
          openDialog,
          closeDialog,
        };
      },
      [openDialog, closeDialog]
    );

    const onShortCutCloseModal = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (isOpen) {
            closeDialog();
          }
        }
      },
      [isOpen, closeDialog]
    );

    useEffect(() => {
      if (isOpen) {
        window.addEventListener("keyup", onShortCutCloseModal);
      } else {
        window.removeEventListener("keyup", onShortCutCloseModal);
      }
      return () => {
        window.removeEventListener("keyup", onShortCutCloseModal);
      };
    }, [isOpen, onShortCutCloseModal]);

    return (
      <dialog ref={dialogRef} open={isOpen} style={{ border: 0 }}>
        <Backdrop
          open={isOpen}
          onClick={closeDialog}
        ></Backdrop>
        <div className={styles.dialog}>
          <div className={styles.dialogContent}>
            <div className={styles.dialogCloseButtonWrap} onClick={closeDialog}>
              <MdClose className={styles.dialogCloseButton} />
            </div>
            {children}
          </div>
        </div>
      </dialog>
    );
  }
);

export default Dailog;
