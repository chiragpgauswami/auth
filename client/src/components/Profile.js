import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidate } from "../helper/validate";
import { convertToBase64 } from "../helper/convert";
import useFetch from "../hooks/fetch.hook";
import { updateUser } from "../helper/helper";

const Profile = () => {
  
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      email: apiData?.email || "",
      mobile: apiData?.mobile || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>,
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  function userLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

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
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{
            height: "auto",
            width: "45%",
            paddingTop: "3em",
            paddingBottom: "3em",
          }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can change your profile here
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  className={`${styles.profile_img} ${extend.profile_img}`}
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                name="profile"
                id="profile"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-5">
                <input
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="First Name"
                  {...formik.getFieldProps("firstName")}
                />
                <input
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Last Name"
                  {...formik.getFieldProps("lastName")}
                />
              </div>

              <div className="name flex w-3/4 gap-5">
                <input
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Phone Number"
                  {...formik.getFieldProps("mobile")}
                />

                <input
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="email"
                  placeholder="Email*"
                  {...formik.getFieldProps("email")}
                />
              </div>

              <input
                className={styles.textbox}
                type="text"
                placeholder="Address"
                {...formik.getFieldProps("address")}
              />

              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{" "}
                <button className="text-red-500" onClick={userLogout} to="/">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
