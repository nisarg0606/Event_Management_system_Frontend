import { enqueueSnackbar } from "notistack";

const InfoToaster = (message) => {
  enqueueSnackbar(message, { variant: "info" });

  return;
};

export default InfoToaster;
