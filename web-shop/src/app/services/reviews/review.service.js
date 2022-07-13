import HttpService from "../http-service";

class ReviewService extends HttpService {
  async getAllReviews() {
    try {
      const response = await this.get("/reviews");

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getReviewsByProductId(id) {
    try {
      const response = await this.get(`/reviews/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createNewReview({ comments, rating }, orderId, userId, productId) {
    console.log({ comments, rating }, { orderId, productId, userId });
    try {
      const response = await this.post("/reviews", {
        body: {
          userId,
          orderId,
          productId,
          comments,
          rating,
        },
      });

      return response.data;
    } catch (error) {
      alert('Bạn đã đánh giá sản phẩm')
      throw new Error(error.message);
    }
  }
  async deleteReview(orderId, productId, userId, comments, rating) {
    try {
      const response = await this.delete(`/reviews`, {
        body: {
          orderId,
          productId,
          userId,
          rating,
          comments
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new ReviewService();
