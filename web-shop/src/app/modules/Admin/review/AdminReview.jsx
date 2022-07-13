import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  Button,
  Spinner,
  Table,
} from "reactstrap";
import reviewService from "../../../services/reviews/review.service";
import './adminreview.scss'

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [value, setValue] = useState("");

  const getAllReview = useCallback(() => {
    reviewService.getAllReviews().then((data) => {
      setReviews(data);
      setIsRunning(true);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    getAllReview();
  }, [getAllReview]);

  const handleDeleteReview = ({ ordersId, productId, userId }, comments, rating) => {
    reviewService.deleteReview(ordersId, productId, userId, comments, rating).then(data => {
      if (data) {
        alert('Đã xóa thành công')
        getAllReview()
      }
    })
  };

  return (
    <Fragment>
      {!isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <div  className="h-[600px] overflow-y-auto" style={{
          padding: '50px',
          fontSize: '14px', 
        }}>
          <Table striped bordered className="text-center bg-white ">
            <thead>
              <tr>
                <th>STT</th>
                <th>Comment đánh giá</th>
                <th>Sản phẩm đánh giá</th>
                <th>Người đánh giá</th>
                <th>Xóa</th>
              </tr>
            </thead>
            {reviews.length > 0 &&
              reviews.map((item, index) => (
                <Fragment key={index}>
                  <tbody>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item.comments}</td>
                      <td>{item.id.productId}</td>
                      <td>{item.id.userId}</td>
                      <td>
                        <Button
                          onClick={() => handleDeleteReview(item['id'], item.comments, item.rating)}
                          className="text-[16px] my-[5px] max-w-[200px]"
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Fragment>
              ))}
          </Table>
        </div>
      )}
    </Fragment>
  );
};

export default AdminReview;
