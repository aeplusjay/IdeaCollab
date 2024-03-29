import React, { useState } from "react";
import Button from "../../utils/button";
import ProgressBar from "../../utils/progress";
import Reset from "../reset/resetPassword";
import LeftContainer from "../../utils/leftContainer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import forgetImg from "../../../assets/verification.svg";
import logo from "../../../assets/logo.svg";
import { useToast } from "@chakra-ui/toast";
import { Box } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

export default function Forgotten(props) {
   const toast = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginWithPhone, setLoginWithPhone] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailEndpoint = "https://pro-go.onrender.com/api/auth/forget-password"; 

  function validateEmail(inputEmail) {
    const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailCheck.test(inputEmail) && inputEmail !== "") {
      document.getElementById("error").style.display = "block";

      if (!inputEmail.includes("@") && !inputEmail.includes(".")) {
        setEmailError("Missing '@' and '.' in the email");
      } else if (!inputEmail.includes("@")) {
        setEmailError("Missing '@' in the email");
      } else if (!inputEmail.includes(".")) {
        setEmailError("Missing '.' in the email");
      } else {
        setEmailError("**Invalid Email");
      }
    } else {
      document.getElementById("error").style.display = "none";
      setEmailError("");
      setEmail(inputEmail);
    }
  }

  function validatePhoneNumber(inputPhoneNumber) {
    const numberCheck = /^[789]\d{9}/;

    if (!numberCheck.test(inputPhoneNumber) && inputPhoneNumber !== "") {
      document.querySelector("#numberError").style.display = "block";
      setPhoneNumberError(
        "**Phone Number should start with 7/8/9 and should have 10 digits, no characters allowed"
      );
    } else {
      document.querySelector("#numberError").style.display = "none";

      setPhoneNumber(inputPhoneNumber);
    }
  }

  function handleSignUp() {
    navigate("/logIn");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const submittedData = {
      email: email,
    };
    setLoading(true);
    try {
      const response = await axios.post(emailEndpoint, submittedData);
      const authToken = response.data.token;

      console.log("Received auth token:", authToken);
      if (response.data.success) {
        console.log(email);
        navigate("/otp", { state: { email: email } });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Server responded with an error:", error.response.data);
        toast({
          title: "Error Notification!",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          position: "top-centre",
          duration: 3000,
          isClosable: true,
          render: () => (
            <Box p={3} color="white" bg="red.500" borderRadius="md">
              <WarningIcon mr={3} />
              {error.response?.data?.message || "An error occurred"}
            </Box>
          ),
        });
        if (error.response.data.message === "No user exist with this email") {
          setEmailError("No user exists with this email");
        }
      } else if (error.request) {
        console.error("No response received. Network error:");
      } else {
        console.error("Error setting up the request:");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {
        <form onSubmit={handleSubmit}>
          <div className="container forContainer">
            <div className="navbar">
              <img src={logo}></img>
              <h3>Pro-Go</h3>
            </div>
            <LeftContainer
              classDiv="loginContainer left"
              src={forgetImg}
              class="loginImage"
              // h1="Sign up for an account today"
            />
            <div className="loginContainer right">
              <div className="num">
                <ProgressBar circleCount={4} color={2} />
                <div className="space">
                  <h1>
                    {loginWithPhone
                      ? "Enter Registered Number"
                      : "Enter Email Address"}
                  </h1>
                  <p className="light">
                    A text with a 6-digit code will be sent to your{" "}
                    {loginWithPhone ? "entered number" : "email address"}.
                  </p>
                </div>
                <div className="Input">
                  <div className="loginWith">
                    <label className="light">
                      {loginWithPhone ? "Phone number" : "Email address"}
                    </label>
                    {/* <a
                    className="blue loginWith"
                    onClick={() => setLoginWithPhone(!loginWithPhone)}
                  >
                    {loginWithPhone ? "Use Email" : "Use Phone number"}
                  </a> */}
                  </div>
                  <input
                    type="text"
                    className="input"
                    maxLength={loginWithPhone ? 10 : 50}
                    onChange={(event) => {
                      loginWithPhone
                        ? validatePhoneNumber(event.target.value)
                        : validateEmail(event.target.value);
                    }}
                    style={{ marginTop: "1vh" }}
                    required
                  />
                  {/* <div>
                  <span id="numberError" className="error">
                    {loginWithPhone ? phoneNumberError : emailError}
                  </span>
                </div> */}
                </div>

                <div
                  className="errorContainer1"
                  style={{
                    display: "block",
                    marginTop: "-1.5vh ",
                    marginLeft: "0",
                    marginBottom: "5vh",
                  }}
                >
                  <span className="error" id="error">
                    Invalid Email
                  </span>
                </div>
                <div
                  className="buttonContainer"
                  style={{ marginBottom: "1vh", marginTop: "2vh" }}
                >
                  <Button
                    type="submit"
                    class="submit button register"
                    label="Submit"
                    loading={loading}
                  />
                </div>
                <div className="lowNavigate">
                  <span className="blue  forLog" onClick={handleSignUp}>
                    Log In
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      }
    </>
  );
}
