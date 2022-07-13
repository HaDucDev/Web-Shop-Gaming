import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput/FormInput";
import authService from "../../../services/auth.service";
import { Spinner, Modal, ModalBody,ModalFooter,ModalHeader, Button } from 'reactstrap'

const Register = (props) => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    phone: "",
    fullName: "",
    address: "",
  });
  const [isRunning, setIsRunning] = useState(false)

  const navigate = useNavigate()

  const [modal, setModal] = useState(false);

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "Tên đăng nhập:",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
      label: "Địa chỉ Email:",
      required: true,
    },
    {
      id: 3,
      name: "phone",
      type: "text",
      placeholder: "phone",
      errorMessage:
        "Phone should be 10 characters number",
      label: "Số điện thoại:",
      pattern: `^[0-9]{3,16}$`,
      required: true,
    },
    {
      id: 4,
      name: "fullName",
      type: "text",
      placeholder: "Fullname",
      errorMessage:
        "Fullname should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Họ và tên:",
      required: true,
    },
    {
      id: 5,
      name: "address",
      type: "text",
      placeholder: "Address",
      errorMessage:
        "Fullname should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Địa chỉ:",
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRunning(true)

    // if(values.address === "" || values.email === ""  || values.fullName === "" || values.phone === "" || values.username === "" )
    // {
    //   alert("Không được để trống thông tin nao .Bạn nhập lỗi. vui lòng kiểm tra lại")
    //   window.location.reload();
    // }
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if(values.email === "")
    {
      alert("Email không được để trống")
      setIsRunning(false);
      //setIsRunning(false);
    }
    else if((!(values.email === "")) && !filter.test(values.email))
    {
      alert("Email không đúng định dạng")
      setIsRunning(false);
      //setIsRunning(false);
    }
    else if(values.address === "")
    {
      alert("Địa chỉ không được để trống")
      setIsRunning(false);
      //window.location.reload();
    }
    else if(values.fullName === "")
    {
      alert("Họ và tên không được để trống")
      setIsRunning(false);
    }
    else if(values.phone === "")
    {
      alert("Số điện thoại không được để trống")
      setIsRunning(false);
    }
    else if((!(Number(values.phone)))   || ((Number(values.phone)<0)))
    {
      alert("Số điện thoại phải là kí tự số và không được <0")
      setIsRunning(false);
    }
    else if(values.username === "")
    {
      alert("Tên đăng nhập không được để trống")
      setIsRunning(false);
    }
    else
    {
      try {
        authService.signUp(values).then(data => {
          console.log(data);
          if (data) {
            //alert('Đăng ký thành công')
            setModal(!modal);
            setIsRunning(false)
            
          }
        })
      } catch (err) {
        alert('Đăng ký không thành công. vui lòng đăng kí lại')
        //console.log(err);
      }
    }
    
  };


  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleroute = () =>{
    navigate('/login')
  }


  return (
    <div className="form-auth">
      <form onSubmit={handleSubmit}>
        <h1>Đăng kí</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button className="flex justify-content-center items-center flex-row-reverse ">Đăng kí
          {
            isRunning && (
              <Spinner size={"sm"} className="m-0" />
            )
          }
        </button>
        <Link to="/login">
          <p className="text-center mb-2">Đăng nhập</p>
        </Link>
      </form>

      <Modal className="bg-secondary" isOpen={modal} toggle={handleSubmit}>
            <ModalHeader toggle={handleSubmit}>
              Đăng kí tài khoản thành công
            </ModalHeader>
            <ModalBody>
              Bạn vui lòng kiểm tra email dùng đăng kí tài khoản để lấy mật khẩu
            </ModalBody>
            <ModalFooter>
                <Button
                  className="bg-primary"
                  color="primary"
                  onClick={() => handleroute()}
                >
                  OK
                </Button>
            </ModalFooter>
          </Modal>
    </div>
  );
};

export default Register;
