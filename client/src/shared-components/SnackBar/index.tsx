import {
  Alert,
  AlertColor,
  Snackbar as MUISnackbar,
  SnackbarProps as MUISnackbarProps,
} from "@mui/material";

interface SnackbarProps extends Omit<MUISnackbarProps, "onClose"> {
  serverity?: AlertColor;
  message?: string;
  onClose?: () => void;
}
const Snackbar: React.FC<SnackbarProps> = ({
  serverity = "info",
  message = "",
  onClose = () => {},
  ...props
}) => {
  return (
    <MUISnackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      autoHideDuration={3000}
      onClose={() => {
        onClose();
      }}
      {...props}
    >
      <Alert
        onClose={onClose}
        severity={serverity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </MUISnackbar>
  );
};

export default Snackbar;
