import { enqueueSnackbar } from "notistack";

const SuccessToaster = (message) => {
  enqueueSnackbar(message, { variant: "success" });

  return;
};

export default SuccessToaster;
