import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidate } from "../helper/validate";

const Reset = () => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd: "",
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

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