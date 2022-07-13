package com.project.beweb.service.impl;

import com.project.beweb.dto.ReviewDTO;
import com.project.beweb.exception.DuplicateException;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.Orders;
import com.project.beweb.model.Reviews;
import com.project.beweb.model.ReviewsIdKey;
import com.project.beweb.repository.ProductRepository;
import com.project.beweb.repository.ReviewsRepository;
import com.project.beweb.service.OrderService;
import com.project.beweb.service.ReviewService;
import com.project.beweb.utils.Constants;
import com.project.beweb.utils.ConvertObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImp implements ReviewService {
  @Autowired
  private ReviewsRepository reviewsRepository;
  @Autowired
  private OrderService orderService;
  @Autowired
  private ProductRepository productRepository;

  @Override
  public Reviews save(Reviews reviews) {
    return reviewsRepository.save(reviews);
  }

  @Override
  public Reviews getReviewById(ReviewsIdKey id) {
    Optional<Reviews> optional = reviewsRepository.findById(id);
    if (!optional.isPresent()) {
      throw new NotFoundException("Can not find this review");
    }

    return optional.get();
  }

  @Override
  public List<ReviewDTO> getAllReviewByProductId(Integer productId) {
    List<Reviews> reviews =
        reviewsRepository.findAllByProduct_ProductId(productId).stream().filter(item -> !item.getDelete()).collect(Collectors.toList());
    List<ReviewDTO> output = new ArrayList<>();

    AtomicReference<Long> cnt = new AtomicReference<>(1L);
    reviews.forEach(item -> {
      output.add(new ReviewDTO(cnt.getAndSet(cnt.get() + 1), item.getUser().getUserId(), item.getOrders().getOrdersId(),
          item.getProduct().getProductId(), item.getComments(), item.getRating(), item.getUser().getAvatar(),
              item.getDateCreate()));
    });

    return output;
  }

  private List<Reviews> split(List<Reviews> reviews, Integer page) {
    int totalPage = (int) Math.ceil((double) reviews.size() / Constants.SIZE_OF_PAGE);
    if (totalPage <= page) {
      return new ArrayList<>();
    }
    if ((page + 1) * Constants.SIZE_OF_PAGE >= reviews.size()) {
      return reviews.subList(page * Constants.SIZE_OF_PAGE, reviews.size());
    }
    return reviews.subList(page * Constants.SIZE_OF_PAGE, (page + 1) * Constants.SIZE_OF_PAGE);
  }

  @Override
  public List<Reviews> getAllReview(Integer page) {
    List<Reviews> reviews =
        reviewsRepository.findAll(Sort.by("id")).stream().filter(item -> !item.getDelete()).collect(Collectors.toList());
    if (page != null) {
      return split(reviews, page);
    }
    return reviews;
  }

  @Override
  public Reviews createNewReviews(ReviewDTO reviewDTO) {
    ReviewsIdKey id = new ReviewsIdKey(reviewDTO.getOrderId(), reviewDTO.getProductId(), reviewDTO.getUserId());

    Optional<Reviews> optional = reviewsRepository.findById(id);
    if (optional.isPresent()) {
      if (optional.get().getDelete()) {
        optional.get().setDelete(false);
        optional.get().setComments(reviewDTO.getComments());
        optional.get().setRating(reviewDTO.getRating());
        return reviewsRepository.save(optional.get());
      }
      throw new DuplicateException("Duplicate review");
    }

    Orders orders = orderService.getOrderById(reviewDTO.getOrderId());
    //đã nhận được hàng thì mới cho nhận xét
    if (!orders.getStatusOrder().equals(Constants.STATUS_ORDER_DELIVERED)) {
      throw new NotFoundException("Can not create review");
    }

    Reviews reviews = ConvertObject.convertReviewDTOToReview(reviewDTO);
    reviews.setId(id);
    reviews.setUser(orders.getUser());
    reviews.setProduct(productRepository.findById(reviewDTO.getProductId()).get());
    reviews.setOrders(orders);
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy hh:mm");
    reviews.setDateCreate(simpleDateFormat.format(new Date()));

    return reviewsRepository.save(reviews);
  }

  @Override
  public Reviews editReview(ReviewDTO reviewDTO) {
    Reviews reviews = getReviewById(
        new ReviewsIdKey(reviewDTO.getOrderId(), reviewDTO.getProductId(), reviewDTO.getUserId())
    );

    reviews.setComments(reviewDTO.getComments());
    reviews.setRating(reviewDTO.getRating());

    return save(reviews);
  }

  @Override
  public void deleteReviewById(ReviewsIdKey id) {
    Reviews reviews = getReviewById(id);

    reviews.setDelete(Boolean.TRUE);

    reviewsRepository.save(reviews);
  }
}
