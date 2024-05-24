import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import Dialog, { DialogRefType } from "@/shared-components/Dialog";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import Snackbar from "@/shared-components/SnackBar";
import { getSnapshot } from "mobx-state-tree";
import { recursiveClearUuid } from "@/libs/utils";

const TemplateGalleryModal = observer(() => {
  const {
    isTemplateGalleryModalVisible,
    setIsTemplateGalleryModalVisible,
    templates,
    addPage,
    postPage,
  } = useStores();
  const [
    addNewPageSuccessSnackbarVisible,
    setAddNewPageSuccessSnackbarVisible,
  ] = useState(false);
  const [addNewPageFailSnackbarVisible, setAddNewPageFailSnackbarVisible] =
    useState(false);
  const dialogRef = useRef<DialogRefType>(null);
  useEffect(() => {
    if (isTemplateGalleryModalVisible) {
      dialogRef.current?.openDialog();
    } else {
      dialogRef.current?.closeDialog();
    }
  }, [isTemplateGalleryModalVisible]);

  return (
    <>
      <Dialog
        ref={dialogRef}
        onClose={() => {
          setIsTemplateGalleryModalVisible(false);
        }}
      >
        <List dense={true}>
          {templates.map((page) => {
            return (
              <ListItem key={page.uuid}>
                <ListItemButton
                  role={undefined}
                  onClick={async () => {
                    try {
                      const ast = recursiveClearUuid(
                        JSON.parse(JSON.stringify(getSnapshot(page.ast)))
                      );
                      await postPage(
                        JSON.stringify({
                          ...page,
                          ast,
                        })
                      );
                      addPage(page);
                      setAddNewPageSuccessSnackbarVisible(true);
                      setIsTemplateGalleryModalVisible(false);
                    } catch (e) {
                      setAddNewPageFailSnackbarVisible(true);
                    }
                  }}
                  dense
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={page.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Dialog>
      <Snackbar
        open={addNewPageSuccessSnackbarVisible}
        serverity="success"
        message="Add new page successed!"
        onClose={() => {
          setAddNewPageSuccessSnackbarVisible(false);
        }}
      />
      <Snackbar
        open={addNewPageFailSnackbarVisible}
        serverity="error"
        message="Add new page failed!"
        onClose={() => {
          setAddNewPageFailSnackbarVisible(false);
        }}
      />
    </>
  );
});

export default TemplateGalleryModal;
