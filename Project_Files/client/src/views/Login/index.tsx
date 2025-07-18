// React Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// MUI Imports
import { Button, Box, Typography } from "@mui/material";
// Custom Imports
import { SubHeading } from "../../components/Heading";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
// React Icons Imports
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Validation Schema Imports
import { loginSchema } from "./components/validationSchema";
// Utils Imports
import { onKeyDown } from "../../utils";
// Redux API
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { setUser } from "../../redux/auth/authSlice";

interface ISLoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // states
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISLoginForm>({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const hideShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // Login Api Bind
  const [loginUser, { isLoading }] = useLoginMutation();

  const LoginHandler = async (data: ISLoginForm) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const user: any = await loginUser(payload);
      if (user?.data?.status) {
        dispatch(setUser(user?.data));
        localStorage.setItem("user", JSON.stringify(user?.data));
        navigate("/");
      }
      if (user?.error) {
        setToast({
          ...toast,
          message: user?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "20px",
            "@media (max-width: 576px)": {
              padding: "30px 20px",
              margin: "10px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <Typography 
              sx={{ 
                fontSize: "24px", 
                color: "black", 
                fontWeight: "bold", 
                fontFamily: "robolics",
                marginBottom: "10px"
              }} 
              component="h1"
            >
              WELCOME TO BOOK A DOCTOR
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontWeight: "bold",
                fontFamily: "robolics",
                fontSize: "20px"
              }}
              variant="h5"
            >
              Login
            </Typography>
          </Box>

          <Formik
            initialValues={formValues}
            onSubmit={(values: ISLoginForm) => {
              LoginHandler(values);
            }}
            validationSchema={loginSchema}
          >
            {(props: FormikProps<ISLoginForm>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
              } = props;

              return (
                <Form onKeyDown={onKeyDown}>
                  <Box sx={{ height: "95px", marginBottom: "10px" }}>
                    <SubHeading sx={{ marginBottom: "5px", color: "black" }}>
                      Email
                    </SubHeading>
                    <PrimaryInput
                      type="text"
                      label=""
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      helperText={errors.email && touched.email ? errors.email : ""}
                      error={errors.email && touched.email ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                  
                  <Box sx={{ height: "95px", marginBottom: "20px" }}>
                    <SubHeading sx={{ marginBottom: "5px", color: "black" }}>
                      Password
                    </SubHeading>
                    <PrimaryInput
                      type={showPassword ? "text" : "password"}
                      label=""
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      helperText={errors.password && touched.password ? errors.password : ""}
                      error={errors.password && touched.password ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onClick={hideShowPassword}
                      endAdornment={
                        showPassword ? (
                          <AiOutlineEye color="disabled" />
                        ) : (
                          <AiOutlineEyeInvisible color="disabled" />
                        )
                      }
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <Typography sx={{ color: "black", fontSize: "14px" }}>
                      New here?{" "}
                      <Link 
                        to="/signup" 
                        style={{ 
                          fontWeight: "bold", 
                          color: "#1976d2", 
                          textDecoration: "none" 
                        }}
                      >
                        Create a new account
                      </Link>
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      padding: "12px 30px",
                      textTransform: "capitalize",
                      borderRadius: "6px",
                      fontSize: "16px",
                    }}
                  >
                    {isLoading ? "Login..." : "Login"}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
      
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </>
  );
};

export default Login;
