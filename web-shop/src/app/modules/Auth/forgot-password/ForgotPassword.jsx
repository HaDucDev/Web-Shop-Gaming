import React, { useState } from "react";

import FormInput from "../components/FormInput/FormInput";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../services/auth.service";
import { data } from "autoprefixer";
import { Spinner } from "reactstrap";

const inputs = [
  {
    id: 1,
    name: "email",
    type: "text",
    placeholder: "email",
    errorMessage:
      "Username should be 3-16 characters and shouldn't include any special character!",
    label: "Email",
    required: true,
  },
];
const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: ""
  });

  const [isRunning, setIsRunning] = useState(false);

  const navigate = useNavigate()

   const handleSubmit = (e) => {
       e.preventDefault()
       setIsRunning(true)
       authService.forgotPassword(values.email).then(data => {
           if (data) {
                setIsRunning(false)
               alert('Đã gửi mã về email')
               navigate('/forgot-confirm')
           }
       })
   }

   const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  return (
    <div className="form-auth">
      <form>
        <h1>Lấy mã xác thực</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}

        <button onClick={handleSubmit} className='flex justify-content-center items-center'>
          {isRunning && <Spinner color="light" size="sm" className="m-0" ></Spinner>}
          Lấy mã</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
