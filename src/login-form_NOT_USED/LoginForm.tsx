import React, { useCallback, useMemo } from "react";
import "./LoginForm.css";
import { Button, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const onSubmit = useCallback(
    (values: { username: string; password: string }, formik: any) => {
      navigate("/mainwindowlibrarian");
      console.log("/mainwindowlibrarian");
    },
    [navigate],
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required("Pole nie może być puste"),
        password: yup
          .string()
          .required("Pole nie może być puste")
          .min(5, "Hasło nie może byc krótsze niż 5 znaków"),
      }),
    [],
  );

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "#b1a20f" }}>Zaloguj się</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange
        validateOnBlur
      >
        {(formik: any) => (
          <form
            className="login-form"
            id="signForm"
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <TextField
              id="username"
              name="username"
              label="Nazwa użytkownika"
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && !!formik.errors.username}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              id="password"
              name="password"
              label="Hasło"
              variant="standard"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              type="submit"
              disabled={!(formik.isValid && formik.dirty)}
            >
              Zaloguj się
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default LoginForm;
