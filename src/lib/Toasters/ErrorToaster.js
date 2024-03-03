import { enqueueSnackbar } from "notistack";

const ErrorToaster = (message) => {
  enqueueSnackbar(message, { variant: "error" });

  return;
};

export default ErrorToaster;
