package com.project.beweb.service;

import com.project.beweb.dto.UserDTO;
import com.project.beweb.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    List<User> getAllUser(Integer page);
    User getUserById(Integer id);
    User getUserByUsername(String username);
    User getUserByEmail(String email);
    User createNewUser(UserDTO userDTO);
    User save(User user);
    User changeAvtById(Integer id, MultipartFile avt);
    void deleteUserById(Integer id);
    User changeInformation(Integer id, UserDTO userDTO, MultipartFile file);

    User setShipperRoleById(Integer id);
    User setAdminRoleById(Integer id);
    User setCustomerRoleById(Integer id);

    List<User> getAllShipper();
    public void aaaaa();
}
