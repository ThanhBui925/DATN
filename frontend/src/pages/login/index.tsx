import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: { email: "admin@gmail.com", password: "12345678" },
      }}
    />
  );
};
