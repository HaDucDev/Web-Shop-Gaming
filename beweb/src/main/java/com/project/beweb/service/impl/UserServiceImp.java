package com.project.beweb.service.impl;

import com.project.beweb.dto.UserDTO;
import com.project.beweb.enumeration.ERole;
import com.project.beweb.exception.DuplicateException;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.Orders;
import com.project.beweb.model.Role;
import com.project.beweb.model.User;
import com.project.beweb.repository.RoleRepository;
import com.project.beweb.repository.UserRepository;
import com.project.beweb.service.AmazonClientService;
import com.project.beweb.service.OrderService;
import com.project.beweb.service.SendMailService;
import com.project.beweb.service.UserService;
import com.project.beweb.utils.Constants;
import com.project.beweb.utils.ConvertObject;
import com.project.beweb.utils.Util;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private RoleRepository roleRepository;

  @Autowired
  private ModelMapper modelMapper;

  @Autowired
  private SendMailService sendMailService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private AmazonClientService amazonClientService;

  @Autowired
  private OrderService orderService;

  private List<User> split(List<User> users, Integer page) {
    int totalPage = (int) Math.ceil((double)users.size() / Constants.SIZE_OF_PAGE);
    if (totalPage <= page) {
      return new ArrayList<>();
    }
    if((page+1) * Constants.SIZE_OF_PAGE >= users.size()) {
      return users.subList(page * Constants.SIZE_OF_PAGE, users.size());
    }
    return users.subList(page * Constants.SIZE_OF_PAGE, (page+1) * Constants.SIZE_OF_PAGE);
  }

  @Override
  public List<User> getAllUser(Integer page) {
    List<User> users =
        userRepository.findAll(Sort.by("userId")).stream().filter(item -> !item.isDelete()).collect(Collectors.toList());
    if (page != null) {
      return split(users, page);
    }
    return users;
  }

  @Override
  public User getUserById(Integer id) {
    Optional<User> user = userRepository.findById(id);
    if (!user.isPresent()) {
      throw new NotFoundException("Can not find user by id: " + id);
    }

    return user.get();
  }

  @Override
  public User getUserByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  @Override
  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  public User createNewUser(UserDTO userDTO) {
    Optional<Role> role = roleRepository.findById(userDTO.getRoleId());
//    if(!role.isPresent()) {
//      throw new NotFoundException("Can not find role by id: " + userDTO.getRoleId());
//    }
    User user = userRepository.findByUsername(userDTO.getUsername());
    if (user != null) {
      throw new DuplicateException("username:" + userDTO.getUsername() + "đã tốn tại. Bạn vui lòng chọn cái khác");
    }

    user = userRepository.findByEmail(userDTO.getEmail());
    if (user != null) {
      throw new DuplicateException("email:" + userDTO.getEmail()+ "đã tồn tại. Bạn vui lòng chọn cái khác");
    }

    String password = Util.generateString();
    sendMailService.sendMailWithText("Đăng ký tài khoản", "Đây là password của bạn: " + password, userDTO.getEmail());

    User req = new User(userDTO.getUsername(), userDTO.getEmail(), passwordEncoder.encode(password),
        userDTO.getFullName(), userDTO.getPhone(), userDTO.getAddress());

    User newUser = userRepository.save(req);

    newUser.setRole(role.get());

    Set<User> users = role.get().getUsers();
    users.add(newUser);
    role.get().setUsers(users);

    roleRepository.save(role.get());

    return save(newUser);
  }

  @Override
  public User save(User user) {
    return userRepository.save(user);
  }

  @Override
  public User changeAvtById(Integer id, MultipartFile avt) {
    User user = getUserById(id);

    user.setAvatar(amazonClientService.uploadFile(avt));

    return save(user);
  }

  @Override
  public void deleteUserById(Integer id) {
    User user = getUserById(id);
    if (!user.getRole().getName().equals(ERole.ROLE_SHIPPER)) {
      user.setDelete(true);
      userRepository.save(user);
      return;
    }
    List<User> shippers = getAllShipper();
    if (shippers.size() <= 1) {
      throw new NotFoundException("Unable to delete shipper. Because the system has only one shipper");
    }
    for (Orders order : orderService.getAllOrderForShipper(user.getUserId())) {
      orderService.setShipperForOrder(order.getOrdersId(),
          orderService.getTheLeastSingleShipper(user.getUserId()).getUserId());
    }
    user.setDelete(true);
    userRepository.save(user);
  }

  @Override
  public User changeInformation(Integer id, UserDTO userDTO, MultipartFile file) {
    User user = getUserById(id);

    if (file != null) {
      user.setAvatar(amazonClientService.uploadFile(file));
    }

    User newUser = ConvertObject.convertUserDTOToUser(user, userDTO);

    Role role = roleRepository.findById(userDTO.getRoleId()).get();
    newUser.setRole(role);

    Set<User> users = role.getUsers();
    users.add(newUser);
    role.setUsers(users);
    roleRepository.save(role);

    return save(newUser);
  }

  @Override
  public User setShipperRoleById(Integer id) {
    User user = getUserById(id);
    user.setRole(roleRepository.findByName(ERole.ROLE_SHIPPER));
    return save(user);
  }

  @Override
  public User setAdminRoleById(Integer id) {
    User user = getUserById(id);
    user.setRole(roleRepository.findByName(ERole.ROLE_ADMIN));
    return save(user);
  }

  @Override
  public User setCustomerRoleById(Integer id) {
    User user = getUserById(id);
    user.setRole(roleRepository.findByName(ERole.ROLE_ADMIN));
    return save(user);
  }

  @Override
  public List<User> getAllShipper() {
    return userRepository.findAllByRole_Name(ERole.ROLE_SHIPPER);
  }

  @Override
  public void aaaaa() {
    userRepository.findAll().forEach(item -> {
      item.setDelete(false);
      userRepository.save(item);
    });
  }
}
