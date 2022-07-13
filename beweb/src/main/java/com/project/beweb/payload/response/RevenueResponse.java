package com.project.beweb.payload.response;

import com.project.beweb.model.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RevenueResponse {
    private Long totalMoney;
    private List<Product> products;
}
