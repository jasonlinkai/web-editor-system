import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import Dialog, { DialogRefType } from "source/shared-components/Dialog";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import Snackbar from "source/shared-components/SnackBar";
import { getSnapshot } from "mobx-state-tree";
import { recursiveClearUuid } from "source/libs/utils";
import { v4 as uuid } from "uuid";
import { PageModel } from "source/libs/mobx/PageModel";

const TemplateGalleryModal = observer(() => {
  const {
    isTemplateGalleryModalVisible,
    setIsTemplateGalleryModalVisible,
    templates,
    addPage,
    ActionPostPage,
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
                      const { updatedAt, createdAt, userId, ...pageData } =
                        await ActionPostPage(
                          JSON.stringify({
                            title: page.title,
                            uuid: uuid(),
                            ast,
                          })
                        );
                      const newPage = PageModel.create({
                        id: pageData.id,
                        title: pageData.title,
                        uuid: pageData.uuid,
                        ast: JSON.parse(pageData.ast),
                      });
                      addPage(newPage);
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
