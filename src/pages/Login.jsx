import { Card, Container, Form } from "react-bootstrap";
import { SVGRegister } from "../components/SVG-register";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import * as YupPassword from "yup-password";
import { Formik, useFormik } from "formik";
import api from "../json-server/api";
import { useToast } from "@chakra-ui/react";

export const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  function toastLoginFailed() {
    return toast({
      title: `Invalid email or password`,
      status: "error",
      isClosable: true,
      duration: 1500,
      position: "top",
    });
  }

  function toastLoginSuccess() {
    toast({
      title: `You are now logged in`,
      status: "success",
      isClosable: true,
      duration: 1500,
      position: "top",
    });
  }

  YupPassword(Yup);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("enter a valid email").required(),
      password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      const res = await api.get("users", {
        params: {
          email: values.email.toLowerCase(),
          password: values.password,
        },
      });
      console.log(res.data[0]);
      const user = res.data[0];
      if (user) return toastLoginFailed();
      localStorage.setItem("todos-auth", user.id);
      
      toastLoginSuccess();
      setTimeout(() => navigate(`/dashboard/${user.fullname}`), 1500);
    },
  });
  return (
    <>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card
          className="d-flex justify-content-center align-items-center vh-100"
          style={{
            width: "100vw",
            padding: "1%",
            backgroundColor: "rgb(227, 175, 154)",
            borderRadius: "30px",
          }}
        >
          <SVGRegister />
          <Formik>
            <Form className="my-5">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  autoFocus
                  onChange={(e) =>
                    formik.setFieldValue(e.target.id, e.target.value)
                  }
                />
                <span className="text-danger">{formik.errors.email}</span>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Your password"
                  autoFocus
                  onChange={(e) =>
                    formik.setFieldValue(e.target.id, e.target.value)
                  }
                />
                <span className="text-danger">{formik.errors.password}</span>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={formik.handleSubmit}
                >
                  Submit
                </Button>
              </div>
              <div className="mt-3">
                Don't have an account?{" "}
                <b>
                  <a href="/register" className="text-decoration-none">
                    Sign Up
                  </a>
                </b>
              </div>
            </Form>
          </Formik>
        </Card>
      </Container>
    </>
  );
};
