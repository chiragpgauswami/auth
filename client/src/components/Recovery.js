import React, { useEffect, useState } from "react";
import styles from "../styles/Username.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";

const Recovery = () => {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      // console.log(OTP);
      if (OTP) return toast.success("OTP sent to your email address.");
      return toast.error("Could not send OTP.");
    });
  }, [username]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (OTP.length !== 6) {
      return toast.error("OTP must be 6 digit.");
    }

    try {
      await verifyOTP({ username, code: OTP }).then((res) => {
        if (res.status === 201) {
          toast.success("OTP verified.");
          return navigate("/reset");
        }
      });
    } catch (error) {
      return toast.error("OTP not verified.");
    }
  };

  const onResend = async () => {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "Sending...",
      success: <b>OTP sent to your email address.</b>,
      error: <b>Could not send OTP.</b>,
    });

    sendPromise.then((OTP) => {
      // console.log(OTP);
    });
  };

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
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover your account.
            </span>
          </div>

          <form className="pt-20" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  value={OTP}
                  className={styles.textbox}
                  type="text"
                  placeholder="OTP"
                />
              </div>
              <button className={styles.btn} type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Can't get OTP?{" "}
                <button
                  type="button"
                  onClick={onResend}
                  className="text-red-500"
                >
                  Resend OTP
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
