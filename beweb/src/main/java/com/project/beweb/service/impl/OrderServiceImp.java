package com.project.beweb.service.impl;

import com.project.beweb.dto.OrderDTO;
import com.project.beweb.dto.OrderDetailDTO;
import com.project.beweb.dto.OrderProductDTO;
import com.project.beweb.enumeration.ERole;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.*;
import com.project.beweb.payload.response.OrderResponse;
import com.project.beweb.payload.response.RevenueResponse;
import com.project.beweb.payload.response.TrueFalseResponse;
import com.project.beweb.repository.OrderRepository;
import com.project.beweb.service.*;
import com.project.beweb.utils.Constants;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImp implements OrderService {
  @Autowired
  private OrderRepository orderRepository;
  @Autowired
  private UserService userService;
  @Autowired
  private OrderDetailService orderDetailService;
  @Autowired
  private ProductService productService;
  @Autowired
  private SendMailService sendMailService;
  @Autowired
  private CartService cartService;

  @Autowired
  private ModelMapper modelMapper;

  @Override
  public Orders getOrderById(Integer id) {
    Optional<Orders> optional = orderRepository.findById(id);
    if (!optional.isPresent()) {
      throw new NotFoundException("Can not find order by id: " + id);
    }
    if (optional.get().isDelete()) {
      throw new NotFoundException("This order was deleted.");
    }

    return optional.get();
  }

  @Override
  public Orders save(Orders order) {
    return orderRepository.save(order);
  }

  @Override
  public TrueFalseResponse createNewOrder(Integer userId, OrderDTO orderDTO) {
    List<OrderProductDTO> orderProductDTOS = new ArrayList<>();
    List<Cart> carts = cartService.getAllCartByUserId(userId);
    AtomicLong totalAmount = new AtomicLong(0L);
    carts.forEach(item -> {
      OrderProductDTO orderProductDTO = new OrderProductDTO(
          item.getProduct().getProductId(),
          item.getQuantity(),
          item.getProduct().getUnitPrice()
      );
      totalAmount.addAndGet(((long) (item.getProduct().getUnitPrice() - ((item.getProduct().getDiscount() / 100f)) * item.getProduct().getUnitPrice()) * item.getQuantity()));
      orderProductDTOS.add(orderProductDTO);
    });


    if (orderProductDTOS.size() == 0) {
      throw new NotFoundException("Can not find product");
    }

    User user = userService.getUserById(userId);

    Orders orders = modelMapper.map(orderDTO, Orders.class);

    orders.setStatusOrder(Constants.STATUS_ORDER_NOT_APPROVED);
    orders.setUser(user);
    orders.setNote(Constants.STATUS_ORDER_UNPAID);

    Orders newOrders = orderRepository.save(orders);

    StringBuilder s = new StringBuilder("<p>Đơn hàng #" + newOrders.getOrdersId() + " đã đặt hàng thành công." + "<p>");
    s.append("<p>Thông tin đơn hàng cho khách hàng: "+ user.getFullName() +".<p>");
    s.append("<html><body><table border ='1' cellpadding='5' cellspacing='5' ><tr><th>Tên sản phẩm       </th><th>Số lượng         </th><th>Đơn giá       </th></tr>");


    //create list order detail
    for (OrderProductDTO orderProductDTO : orderProductDTOS) {
      OrderDetail orderDetail = orderDetailService.createNewOrderDetail(
          newOrders.getOrdersId(),
          orderProductDTO.getProductId(),
          new OrderDetailDTO(
              orderProductDTO.getQuality(),
              Long.parseLong(String.valueOf(orderProductDTO.getQuality() * orderProductDTO.getPrice())),
              "No"
          )
      );

      Product product = productService.getProductById(orderProductDTO.getProductId());

//      totalAmount += orderDetail.getAmount() - (product.getDiscount() / 100f * orderDetail.getAmount());


      s.append("<tr><td>"+product.getProductName()+"</td><td>    "+orderProductDTO.getQuality() +"</td><td>   "
              + (orderProductDTO.getPrice() - (product.getDiscount() / 100f * orderProductDTO.getPrice()))+" VNĐ</td></tr>");

      int newQuality = product.getQuantity() - orderProductDTO.getQuality();
      if (newQuality < 0) {
        throw new NotFoundException("Not enough quantity");
      }
      product.setQuantity(newQuality);
      productService.save(product);
    }

    s.append("</table><br></body></html>");
    newOrders.setTotalAmount(totalAmount.get());

    List<Cart> carts2 = cartService.getAllCartByUserId(userId);
    carts2.forEach(item -> cartService.deleteCartById(item.getId()));

    s.append("<p>Tổng tiền: "+ newOrders.getTotalAmount() + " VNĐ</p>");

    sendMailService.sendMailWithText("Đơn hàng của bạn!", s.toString(), user.getEmail());

    orderRepository.save(newOrders);
    return new TrueFalseResponse(true);
  }

  @Override
  public TrueFalseResponse createNewOrder2(Integer userId, OrderDTO orderDTO) {
    List<OrderProductDTO> orderProductDTOS = new ArrayList<>();
    List<Cart> carts = cartService.getAllCartByUserId(userId);
    AtomicLong totalAmount = new AtomicLong(0L);
    carts.forEach(item -> {
      OrderProductDTO orderProductDTO = new OrderProductDTO(
          item.getProduct().getProductId(),
          item.getQuantity(),
          item.getProduct().getUnitPrice()
      );
      totalAmount.addAndGet(((long) (item.getProduct().getUnitPrice() - ((item.getProduct().getDiscount() / 100f)) * item.getProduct().getUnitPrice()) * item.getQuantity()));
      orderProductDTOS.add(orderProductDTO);
    });

    if (orderDTO.getStatusCode() == 1002 || orderDTO.getStatusCode() == 1003) {
      throw new NotFoundException("Lỗi thanh toán!");
    }
    if (orderProductDTOS.size() == 0) {
      throw new NotFoundException("Can not find product");
    }

    User user = userService.getUserById(userId);

    Orders orders = modelMapper.map(orderDTO, Orders.class);

    orders.setStatusOrder(Constants.STATUS_ORDER_NOT_APPROVED);
    orders.setUser(user);
    if (orderDTO.getStatusCode() == 9000) {
      orders.setNote(Constants.STATUS_ORDER_PAID);
    } else {
      orders.setNote(Constants.STATUS_ORDER_UNPAID);
    }

    Orders newOrders = orderRepository.save(orders);

    StringBuilder s = new StringBuilder("Đơn hàng " + newOrders.getOrdersId() + " đã đặt hàng thành công.");
    s.append("<p>Thông tin đơn hàng cho khách hàng: "+ user.getFullName() +".<p>");
    s.append("<html><body><table border ='1' cellpadding='5' cellspacing='5' ><tr><th>Tên sản phẩm       </th><th>Số lượng         </th><th>Đơn giá       </th></tr>");

    //create list order detail
    for (OrderProductDTO orderProductDTO : orderProductDTOS) {
      OrderDetail orderDetail = orderDetailService.createNewOrderDetail(
          newOrders.getOrdersId(),
          orderProductDTO.getProductId(),
          new OrderDetailDTO(
              orderProductDTO.getQuality(),
              Long.parseLong(String.valueOf(orderProductDTO.getQuality() * orderProductDTO.getPrice())),
              "No"
          )
      );

      Product product = productService.getProductById(orderProductDTO.getProductId());

      s.append("<tr><td>"+product.getProductName()+"</td><td>    "+orderProductDTO.getQuality() +"</td><td>   "
              + (orderProductDTO.getPrice() - (product.getDiscount() / 100f * orderProductDTO.getPrice()))+" VNĐ</td></tr>");


      int newQuality = product.getQuantity() - orderProductDTO.getQuality();
      if (newQuality < 0) {
        throw new NotFoundException("Not enough quantity");
      }
      product.setQuantity(newQuality);
      productService.save(product);
    }

    s.append("</table><br></body></html>");

    newOrders.setTotalAmount(Long.parseLong(String.valueOf(totalAmount)));

    List<Cart> carts2 = cartService.getAllCartByUserId(userId);
    carts2.forEach(item -> cartService.deleteCartById(item.getId()));

    s.append("<p>Tổng tiền: "+ newOrders.getTotalAmount() + " VNĐ</p>");

    sendMailService.sendMailWithText("Đơn hàng của bạn!", s.toString(), user.getEmail());

    orderRepository.save(newOrders);
    return new TrueFalseResponse(true);
  }

  @Override
  public Orders editNewOrderById(Integer userId, Integer orderId, OrderDTO orderDTO) {
    User user = userService.getUserById(userId);

    Optional<Orders> optional = orderRepository.findById(orderId);

    if (!optional.isPresent()) {
      throw new NotFoundException("Can not find order by id: " + orderId);
    }

    Orders orders = optional.get();

    orders.setDelete(true);
    save(orders);
    ///////////

    Orders orders2 = modelMapper.map(orderDTO, Orders.class);
    orders2.setStatusOrder(Constants.STATUS_ORDER_NOT_APPROVED);
    orders2.setUser(user);
    orders2.setNote(Constants.STATUS_ORDER_UNPAID);

    Orders newOrders = orderRepository.save(orders2);
    int totalAmount = 0;
    //create list order detail
    for (OrderProductDTO orderProductDTO : orderDTO.getOrderProductDTOS()) {
      OrderDetail orderDetail = orderDetailService.createNewOrderDetail(
          newOrders.getOrdersId(),
          orderProductDTO.getProductId(),
          new OrderDetailDTO(
              orderProductDTO.getQuality(),
              Long.parseLong(String.valueOf(orderProductDTO.getQuality() * orderProductDTO.getPrice())),
              "No"
          )
      );

      totalAmount += orderDetail.getAmount();

      Product product = productService.getProductById(orderProductDTO.getProductId());

      int newQuality = product.getQuantity() - orderProductDTO.getQuality();
      if (newQuality < 0) {
        throw new NotFoundException("Not enough quantity");
      }
      product.setQuantity(newQuality);
      productService.save(product);
    }

    newOrders.setTotalAmount(Long.parseLong(String.valueOf(totalAmount)));

    return save(newOrders);
  }

  @Override
  public Orders nextStatusOrderById(Integer id) {
    Orders orders = getOrderById(id);

    if (orders.getStatusOrder().equals(Constants.STATUS_ORDER_NOT_APPROVED)) {
      orders.setStatusOrder(Constants.STATUS_ORDER_APPROVED);
      //set shipper
      setShipperForOrder(id, getTheLeastSingleShipper(null).getUserId());
    } else if (orders.getStatusOrder().equals(Constants.STATUS_ORDER_APPROVED)) {
      orders.setStatusOrder(Constants.STATUS_ORDER_DELIVERED);
      sendMailService.sendMailWithText("Thông báo giao hàng thành công", "Cảm ơn bạn đã đặt hàng!",
          orders.getUser().getEmail());
    }

    return orderRepository.save(orders);
  }

  @Override
  public Orders setCancelledStatusOrderById(Integer id) {
    Orders orders = getOrderById(id);

    if (orders.getStatusOrder().equals(Constants.STATUS_ORDER_NOT_APPROVED)) {
      orders.setStatusOrder(Constants.STATUS_ORDER_CANCELLED);
    } else if (orders.getStatusOrder().equals(Constants.STATUS_ORDER_APPROVED)) {
      orders.setStatusOrder(Constants.STATUS_ORDER_CANCELLED);
    } else {
      return orders;
    }

    return orderRepository.save(orders);
  }

  private List<Orders> split(List<Orders> orders, Integer page) {
    int totalPage = (int) Math.ceil((double) orders.size() / Constants.SIZE_OF_PAGE);
    if (totalPage <= page) {
      return new ArrayList<>();
    }
    if ((page + 1) * Constants.SIZE_OF_PAGE >= orders.size()) {
      return orders.subList(page * Constants.SIZE_OF_PAGE, orders.size());
    }
    return orders.subList(page * Constants.SIZE_OF_PAGE, (page + 1) * Constants.SIZE_OF_PAGE);
  }

  private List<OrderResponse> split2(List<OrderResponse> orders, Integer page) {
    int totalPage = (int) Math.ceil((double) orders.size() / Constants.SIZE_OF_PAGE);
    if (totalPage <= page) {
      return new ArrayList<>();
    }
    if ((page + 1) * Constants.SIZE_OF_PAGE >= orders.size()) {
      return orders.subList(page * Constants.SIZE_OF_PAGE, orders.size());
    }
    return orders.subList(page * Constants.SIZE_OF_PAGE, (page + 1) * Constants.SIZE_OF_PAGE);
  }

  @Override
  public List<OrderResponse> getAllOrder(Integer page) {
    List<OrderResponse> output = new ArrayList<>();
    List<Orders> orders = orderRepository.findAll(Sort.by("ordersId").descending());

    for (Orders order : orders) {
      if (order.isDelete()) {
        continue;
      }
      List<Product> products = new ArrayList<>();
      Set<OrderDetail> orderDetails = order.getOrderDetailEntities();
      for (OrderDetail orderDetail : orderDetails) {
        Product product = new Product();
        product.setProductId(orderDetail.getProduct().getProductId());
        product.setProductImage(orderDetail.getProduct().getProductImage());
        product.setProductName(orderDetail.getProduct().getProductName());
        product.setCartEntities(orderDetail.getProduct().getCartEntities());
        product.setDescriptionProduct(orderDetail.getProduct().getDescriptionProduct());
        product.setReviewsEntities(orderDetail.getProduct().getReviewsEntities());
        product.setProductEntities(orderDetail.getProduct().getProductEntities());
        product.setQuantity(orderDetail.getQuantity());
        product.setCategory(orderDetail.getProduct().getCategory());
        product.setDiscount(orderDetail.getProduct().getDiscount());
        product.setSupplier(orderDetail.getProduct().getSupplier());
        product.setUnitPrice(orderDetail.getProduct().getUnitPrice());
        products.add(product);
      }
      if (order.getShipperId() != null) {
        User shipper = userService.getUserById(order.getShipperId());
        output.add(new OrderResponse(order.getOrdersId(), products, order.getTotalAmount(), order.getAddress(),
            order.getPhoneNumber(), order.getUser(), order.getNote(), order.getStatusOrder(),
            order.getCreateDate().toString().substring(0, 10), shipper.getFullName()));
      } else {
        output.add(new OrderResponse(order.getOrdersId(), products, order.getTotalAmount(), order.getAddress(),
            order.getPhoneNumber(), order.getUser(), order.getNote(), order.getStatusOrder(),
            order.getCreateDate().toString().substring(0, 10), "Chưa có shipper"));
      }
    }

    if (page != null) {
      output = split2(output, page);
    }

    return output;
  }

  @Override
  public List<OrderResponse> getAllOrderByUserId(Integer userId) {
    List<OrderResponse> output = new ArrayList<>();
    List<Orders> orders = orderRepository.findAll(Sort.by("ordersId").descending())
        .stream().filter(item -> (Objects.equals(userId, item.getUser().getUserId())))
        .collect(Collectors.toList());

    for (Orders order : orders) {
      if (order.isDelete()) {
        continue;
      }
      List<Product> products = new ArrayList<>();
      Set<OrderDetail> orderDetails = order.getOrderDetailEntities();
      for (OrderDetail orderDetail : orderDetails) {
        Product product = new Product();
        product.setProductId(orderDetail.getProduct().getProductId());
        product.setProductImage(orderDetail.getProduct().getProductImage());
        product.setProductName(orderDetail.getProduct().getProductName());
        product.setCartEntities(orderDetail.getProduct().getCartEntities());
        product.setDescriptionProduct(orderDetail.getProduct().getDescriptionProduct());
        product.setReviewsEntities(orderDetail.getProduct().getReviewsEntities());
        product.setProductEntities(orderDetail.getProduct().getProductEntities());
        product.setQuantity(orderDetail.getQuantity());
        product.setCategory(orderDetail.getProduct().getCategory());
        product.setDiscount(orderDetail.getProduct().getDiscount());
        product.setSupplier(orderDetail.getProduct().getSupplier());
        product.setUnitPrice(orderDetail.getProduct().getUnitPrice());
        products.add(product);
      }
      if (order.getShipperId() != null) {
        User shipper = userService.getUserById(order.getShipperId());
        output.add(new OrderResponse(order.getOrdersId(), products, order.getTotalAmount(), order.getAddress(),
            order.getPhoneNumber(), order.getUser(), order.getNote(), order.getStatusOrder(),
            order.getCreateDate().toString().substring(0, 10), shipper.getFullName()));
      } else {
        output.add(new OrderResponse(order.getOrdersId(), products, order.getTotalAmount(), order.getAddress(),
            order.getPhoneNumber(), order.getUser(), order.getNote(), order.getStatusOrder(),
            order.getCreateDate().toString().substring(0, 10), "Chưa có shipper"));
      }
    }

    return output;
  }

  @Override
  public List<Orders> getAllOrderForShipper(Integer userId) {
    return orderRepository.findAll()
        .stream()
        .filter(item -> Objects.equals(item.getShipperId(), userId)
            && !item.isDelete()
            && item.getStatusOrder().equals(Constants.STATUS_ORDER_APPROVED))
        .collect(Collectors.toList());
  }

  @Override
  public Orders setShipperForOrder(Integer orderId, Integer shipperId) {
    User user = userService.getUserById(shipperId);
    if (!user.getRole().getName().equals(ERole.ROLE_SHIPPER)) {
      throw new NotFoundException("This user is not shipper");
    }
    Orders orders = getOrderById(orderId);

    orders.setShipperId(shipperId);

    return save(orders);
  }

  @Override
  public Orders removeCurrentShipper(Integer orderId) {
    Orders orders = getOrderById(orderId);

    orders.setShipperId(getTheLeastSingleShipper(orders.getShipperId()).getUserId());

    return save(orders);
  }

  @Override
  public TrueFalseResponse deleteOrderById(Integer id) {
    Orders orders = getOrderById(id);

    if (orders.getNote().equals(Constants.STATUS_ORDER_PAID)) {
      throw new NotFoundException("The order cannot be deleted because it has already been paid");
    }

    orders.setDelete(true);

    orderRepository.save(orders);

    return new TrueFalseResponse(true);
  }

  @Override
  public void setStatusOrderPaidById(Integer id) {// cai nay ko dung
    Orders orders = getOrderById(id);

    if (orders.getNote().equals(Constants.STATUS_ORDER_PAID)) {
      throw new NotFoundException("This order was paid");
    }

    User user = orders.getUser();
    String str = "";

    for (OrderDetail orderDetail : orders.getOrderDetailEntities()) {
      str += "\t\t" + orderDetail.getProduct().getProductName() + " - số lượng: " + orderDetail.getQuantity() + " sản" +
          " phẩm\n";
    }

    sendMailService.sendMailWithText(
        "Hóa đơn hàng",
        "Bạn đã đặt hàng thành công\n" +
            "Đơn hàng gồm: \n" + str + "\nTổng tiền là: " + String.format("%,d", orders.getTotalAmount()) + " VNĐ.",
        user.getEmail()
    );

    orders.setNote(Constants.STATUS_ORDER_PAID);
    save(orders);
  }

  @Override
  public User getTheLeastSingleShipper(Integer toExcludeShipper) {
    List<User> users =
        userService.getAllShipper().stream().filter(item -> !item.isDelete()).collect(Collectors.toList());

    int len = users.size();
    for (int i = 0; i < len - 1; i++) {
      for (int j = i + 1; j < len; j++) {
        int cnt1 = orderRepository.findAllByShipperId(users.get(i).getUserId()).size();
        int cnt2 = orderRepository.findAllByShipperId(users.get(j).getUserId()).size();
        if (cnt1 < cnt2) {
          Collections.swap(users, i, j);
        }
      }
    }

    if (toExcludeShipper == null) {
      return users.get(len - 1);
    }

    for (int i = 0; i < len; i++) {
      if (users.get(i).getUserId() == toExcludeShipper) {
        if (i - 1 < 0) {
          return users.get(len - 1);
        }
        return users.get(i - 1);
      }
    }
    return users.get(len - 1);
  }

  @Override
  public List<Orders> getAllOrdersByDate(Date start, Date end) {
    return orderRepository.findAllByCreateDateIsBetween(start, end);
  }

  @Override
  public List<Orders> getAllOrdersByYear(Integer year) {
    return orderRepository.findAll()
        .stream().filter(item -> {
          Date date = new Date(item.getCreateDate().getTime());
          return Integer.parseInt(date.toString().split("-")[0]) == year;
        })
        .collect(Collectors.toList());
  }


//   carts.forEach(item -> {
//    OrderProductDTO orderProductDTO = new OrderProductDTO(
//            item.getProduct().getProductId(),
//            item.getQuantity(),
//            item.getProduct().getUnitPrice()
//    );
//    totalAmount.addAndGet(((long) (item.getProduct().getUnitPrice() - ((item.getProduct().getDiscount() / 100f)) * item.getProduct().getUnitPrice()) * item.getQuantity()));
//    orderProductDTOS.add(orderProductDTO);
//  });

  @Override
  public RevenueResponse getRevenueByOrdersList(List<Orders> orders) {
    List<Product> products = new ArrayList<>();
    Long totalMoney = 0L;
    for (Orders o : orders) {
      totalMoney += o.getTotalAmount();
      for (OrderDetail orderDetail : o.getOrderDetailEntities()) {
        Product product = orderDetail.getProduct();
        Product newProduct = new Product();
        if (products.contains(product)) {
          int index = products.indexOf(product);
          products.get(index).setQuantity(products.get(index).getQuantity() + orderDetail.getQuantity());
        } else {
          newProduct.setQuantity(orderDetail.getQuantity());
          newProduct.setProductId(orderDetail.getProduct().getProductId());
          newProduct.setProductName(orderDetail.getProduct().getProductName());
          newProduct.setProductImage(orderDetail.getProduct().getProductImage());
          newProduct.setDescriptionProduct(orderDetail.getProduct().getDescriptionProduct());
          newProduct.setProductEntities(orderDetail.getProduct().getProductEntities());
          newProduct.setCategory(orderDetail.getProduct().getCategory());
          newProduct.setSupplier(orderDetail.getProduct().getSupplier());
          newProduct.setUnitPrice(orderDetail.getProduct().getUnitPrice());
          newProduct.setDiscount(orderDetail.getProduct().getDiscount());
          newProduct.setReviewsEntities(orderDetail.getProduct().getReviewsEntities());
          newProduct.setCartEntities(orderDetail.getProduct().getCartEntities());
          products.add(newProduct);
        }
      }
    }
    return new RevenueResponse(totalMoney, products);
  }

  @Override
  public RevenueResponse getRevenueByDate(Date start, Date end) {
    List<Orders> orders = getAllOrdersByDate(start, end);
    return getRevenueByOrdersList(orders);
  }

  @Override
  public RevenueResponse getRevenueByYear(Integer year) {
    List<Orders> orders = getAllOrdersByYear(year);
    return getRevenueByOrdersList(orders);
  }

  @Override
  public List<OrderResponse> filter(Integer page, Integer type) {
    List<Orders> orders;
    if (type == 1) {
      orders = orderRepository.findAllByStatusOrder(Constants.STATUS_ORDER_DELIVERED);
    } else if (type == 2) {
      orders = orderRepository.findAllByStatusOrder(Constants.STATUS_ORDER_NOT_APPROVED);
    } else if (type == 3) {
      orders = orderRepository.findAllByStatusOrder(Constants.STATUS_ORDER_APPROVED);
    } else {
      orders = orderRepository.findAllByStatusOrder(Constants.STATUS_ORDER_CANCELLED);
    }
    List<OrderResponse> output = new ArrayList<>();
    for (Orders order : orders) {
      if (order.isDelete()) {
        continue;
      }
      List<Product> products = new ArrayList<>();
      Set<OrderDetail> orderDetails = order.getOrderDetailEntities();
      for (OrderDetail orderDetail : orderDetails) {
        Product product = new Product();
        product.setProductId(orderDetail.getProduct().getProductId());
        product.setProductImage(orderDetail.getProduct().getProductImage());
        product.setProductName(orderDetail.getProduct().getProductName());
        product.setCartEntities(orderDetail.getProduct().getCartEntities());
        product.setDescriptionProduct(orderDetail.getProduct().getDescriptionProduct());
        product.setReviewsEntities(orderDetail.getProduct().getReviewsEntities());
        product.setProductEntities(orderDetail.getProduct().getProductEntities());
        product.setQuantity(orderDetail.getQuantity());
        product.setCategory(orderDetail.getProduct().getCategory());
        product.setDiscount(orderDetail.getProduct().getDiscount());
        product.setSupplier(orderDetail.getProduct().getSupplier());
        product.setUnitPrice(orderDetail.getProduct().getUnitPrice());
        products.add(product);
      }
      if (order.getShipperId() != null) {
        User shipper = userService.getUserById(order.getShipperId());
        output.add(new OrderResponse(order.getOrdersId(), products, order.getTotalAmount(), order.getAddress(),
            order.getPhoneNumber(), order.getUser(), order.getNote(), order.getStatusOrder(),
            order.getCreateDate().toString().substring(0, 10), shipper.getFullName()));
      } else {
        output.add(new OrderResponse(order.getOrdersId(), products, order.getTotalAmount(), order.getAddress(),
            order.getPhoneNumber(), order.getUser(), order.getNote(), order.getStatusOrder(),
            order.getCreateDate().toString().substring(0, 10), "Chưa có shipper"));
      }
    }
    return page != null ? split2(output, page) : output;
  }

}
