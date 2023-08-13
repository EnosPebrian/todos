import { Card, Container, Form } from "react-bootstrap";
import { SVGRegister } from "../components/SVG";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import * as YupPassword from "yup-password";
import { Formik, useFormik } from "formik";
import api from "../json-server/api";
import { useToast } from "@chakra-ui/react";

export const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();

  function toastRegisterSuccess() {
    return toast({
      title: `Your account has been successfully created`,
      status: "success",
      isClosable: true,
      duration: 1500,
      position: "top",
    });
  }
  function toastUsedEmail() {
    return toast({
      title: `Email has been used`,
      status: "error",
      isClosable: true,
      duration: 1500,
      position: "top",
    });
  }

  async function queryUser(values) {
    const res = await api.get(`/users?email=${values.email}`);
    return res.data;
  }

  YupPassword(Yup);
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object().shape({
      fullname: Yup.string()
        .matches(/^[A-Za-z\s]*$/, "number and symbol is not allowed")
        .required(`Please provide a name`),
      email: Yup.string().email("enter a valid email").required(),
      password: Yup.string()
        .password()
        .min(8, "Too short")
        .minNumbers(1, "You have at least a number")
        .minLowercase(1, "You have at least a lowercase character")
        .minUppercase(1, "You have at least an uppercase character")
        .minSymbols(1, "You have at least a symbol")
        .required("Please provide a password"),
      confirmpassword: Yup.string()
        .password()
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      values.email = values.email.toLowerCase();
      try {
        const [anyUser] = await queryUser(values);
        if (anyUser && anyUser?.email === values.email) return toastUsedEmail();

        const temp = { ...values };
        delete temp["confirmpassword"];
        await api.post(`users`, temp);
      } catch (err) {
        console.log(err);
      }
      toastRegisterSuccess();
      setTimeout(() => navigate("/login"), 1500);
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
              <Form.Group className="mb-3" controlId="fullname">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Full Name"
                  autoFocus
                  onChange={(e) =>
                    formik.setFieldValue(e.target.id, e.target.value)
                  }
                />
                <span className="text-danger">{formik.errors.fullname}</span>
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
              <Form.Group className="mb-3" controlId="confirmpassword">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  autoFocus
                  onChange={(e) =>
                    formik.setFieldValue(e.target.id, e.target.value)
                  }
                />
                <span className="text-danger">
                  {formik.values.password === formik.values.confirmpassword
                    ? null
                    : "Your password and confirmation password does not match"}
                </span>
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
                Already have an account?{" "}
                <b>
                  <a href="/login" className="text-decoration-none">
                    Sign In
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
