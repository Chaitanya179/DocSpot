// React Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// React Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// Utils Imports
import { onKeyDown } from "../../utils";
// Validation Schema
import { signupSchema } from "./components/validationSchema";
// MUI Imports
import { Box, Button, Typography } from "@mui/material";
// Custom Imports
import { SubHeading } from "../../components/Heading";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
// Redux API
import { useSignupMutation } from "../../redux/api/authApiSlice";
import PrimaryPhoneInput from "../../components/PhoneInput";

interface ISSignupForm {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  // states
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISSignupForm>({
    name: "",
    email: "",
    phoneNumber: "",
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

  // Sign Up Api Bind
  const [signupUser, { isLoading }] = useSignupMutation();

  const signupHandler = async (data: ISSignupForm) => {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
    };
    try {
      const user: any = await signupUser(payload);

      if (user?.data?.status) {
        setToast({
          ...toast,
          message: "User Successfully Created",
          appearence: true,
          type: "success",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
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
      console.error("SignUp Error:", error);
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
            maxWidth: "450px",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "20px",
            maxHeight: "90vh",
            overflowY: "auto",
            "@media (max-width: 576px)": {
              padding: "30px 20px",
              margin: "10px",
              maxHeight: "95vh",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "25px",
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
              Create an Account
            </Typography>
          </Box>

          <Formik
            initialValues={formValues}
            onSubmit={(values: ISSignupForm) => {
              signupHandler(values);
            }}
            validationSchema={signupSchema}
          >
            {(props: FormikProps<ISSignupForm>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
              } = props;

              return (
                <Form onKeyDown={onKeyDown}>
                  <Box sx={{ height: "95px", marginBottom: "5px" }}>
                    <SubHeading sx={{ marginBottom: "5px", color: "black" }}>
                      Name
                    </SubHeading>
                    <PrimaryInput
                      type="text"
                      label=""
                      name="name"
                      placeholder="Name"
                      value={values.name}
                      helperText={errors.name && touched.name ? errors.name : ""}
                      error={errors.name && touched.name ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                  
                  <Box sx={{ height: "95px", marginBottom: "5px" }}>
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

                  <Box sx={{ height: "95px", marginBottom: "5px" }}>
                    <SubHeading sx={{ marginBottom: "5px", color: "black" }}>
                      Mobile Number
                    </SubHeading>
                    <PrimaryPhoneInput
                      value={props.values.phoneNumber || '+91'}
                      name="phoneNumber"
                      formik={props}
                      variant="outlined"
                      label=""
                    />
                  </Box>

                  <Box sx={{ height: "95px", marginBottom: "15px" }}>
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
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          fontWeight: "bold",
                          color: "#1976d2",
                          textDecoration: "none",
                        }}
                      >
                        Login
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
                    {isLoading ? "Sign Up..." : "Sign Up"}
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

export default Signup;