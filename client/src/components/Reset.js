import React, { useEffect } from "react";
import styles from "../styles/Username.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidate } from "../helper/validate";
import { resetPassword } from "../helper/helper";
import { useAuthStore } from "../store/store";
import { Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";

const Reset = () => {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] =
    useFetch("createResetSession");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd: "",
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: "Updating...",
        success: <b>Your Password is updated sucessfully...!</b>,
        error: <b>Could not update Password.</b>,
      });

      resetPromise.then(() => {
        navigate("/password");
      });
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  if (status && status !== 201)
    return <Navigate to={"/password"} replace={true}></Navigate>;

  return (
    <div className="container mx-auto">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "",
          // style: {
          //   padding: "16px",
          //   color: "#fff",
          //   background: "#333",
          //   fontSize: "1.5rem",
          // },
        }}
      />

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter your new password.
            </span>
          </div>

          <form className="pt-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                className={styles.textbox}
                type="text"
                placeholder="New Password"
                {...formik.getFieldProps("password")}
              />
              <input
                className={styles.textbox}
                type="text"
                placeholder="Confirm Password"
                {...formik.getFieldProps("confirm_pwd")}
              />
              <button className={styles.btn} type="submit">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
