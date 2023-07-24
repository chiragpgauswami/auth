import { toast } from "react-hot-toast";
import { authenticate } from "./helper";

export const usernameValidate = async (values) => {
  const errors = usernameVerify({}, values);

  if (values.username) {
    const { status } = await authenticate(values.username);
    if (status != 200) {
      errors.exist = toast.error("Username does not exist");
    }
  }

  return errors;
};

export const passwordValidate = async (values) => {
  const errors = passwordVerify({}, values);
  return errors;
};

export const resetPasswordValidate = async (values) => {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.confirm_pwd = toast.error("Passwords do not match");
  }

  return errors;
};

export const registerValidate = async (values) => {
  const errors = usernameVerify({}, values);
  emailVerify(errors, values);
  passwordVerify(errors, values);

  return errors;
};

export const profileValidate = async (values) => {
  const errors = emailVerify({}, values);

  return errors;
};

const usernameVerify = (error = {}, values) => {
  if (!values.username) {
    error.username = toast.error("Username is required");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username");
  }
  return error;
};

const passwordVerify = (errors = {}, values) => {
  const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    errors.password = toast.error("Password is required");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Invalid Password");
  } else if (values.password.length < 6) {
    errors.password = toast.error("Password must be at least 6 characters");
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error(
      "Password must contain at least one special character"
    );
  }

  return errors;
};

const emailVerify = (errors = {}, values) => {
  if (!values.email) {
    errors.email = toast.error("Email is required");
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = toast.error("Invalid Email");
  }

  return errors;
};
