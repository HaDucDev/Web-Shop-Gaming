import React from 'react'
import './Contact.scss'

const Contact = () => {

  //window.location.replace(data.payUrl);
  return (
    <div className="px-20 py-8  pb-[100px] " style={{
      margin: '0% 30%'
    }}>
      <h1 style={{
        fontSize: '30px',
        color: 'blue'
      }}>Hãy liên hệ với chúng tôi</h1>
      <p>
        <b>

          Địa chỉ: Số 100 Quận 9 Thành phố Hồ Chí Minh<br />
          Số điện thoại: 0986969969<br />
          Zalo: 0985233553<br />
          Gmail: xinchaoban1234@gmail.com<br />
        </b>
      </p>
      <h2>I/ Rất hân hạnh được phục vụ quá khách</h2>
      <h2>IV / Thời gian làm việc:</h2>
      <p>
        – Từ T2 T6 : ( Từ 10h đến 19h )
        <br />
        – Thứ 7, chủ nhẩ từ 10h đến 12h30.
        <br />
        </p>
      <h1>XIN CẢM ƠN</h1>
    </div>
  )
}

export default Contact