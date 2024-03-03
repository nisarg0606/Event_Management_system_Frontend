import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import LandingLayout from "@/layouts/LandingLayout";

const LayoutMapping = {
  auth: AuthLayout,
  default: DefaultLayout,
  landing: LandingLayout
};

const getLayout = (type = "default") => {
  return LayoutMapping[type] ?? LayoutMapping.default;
};

export default getLayout