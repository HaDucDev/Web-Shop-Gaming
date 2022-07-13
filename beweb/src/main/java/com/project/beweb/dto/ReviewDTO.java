package com.project.beweb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private Integer userId;
    private Integer orderId;
    private Integer productId;
    private String comments;
    private Integer rating;
    private String avatar;
    private String dateCreate;
}
