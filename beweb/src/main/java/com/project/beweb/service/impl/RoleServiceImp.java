package com.project.beweb.service.impl;

import com.project.beweb.enumeration.ERole;
import com.project.beweb.model.Role;
import com.project.beweb.repository.RoleRepository;
import com.project.beweb.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImp implements RoleService {
    @Autowired
    RoleRepository roleRepository;

    @Override
    public Role getRoleByName(String name) {
        if(name.equals(ERole.ROLE_ADMIN.name())) {
            return roleRepository.findByName(ERole.ROLE_ADMIN);
        }
        if(name.equals(ERole.ROLE_SHIPPER.name())) {
            return roleRepository.findByName(ERole.ROLE_SHIPPER);
        }
        return roleRepository.findByName(ERole.ROLE_CUSTOMER);
    }
}
