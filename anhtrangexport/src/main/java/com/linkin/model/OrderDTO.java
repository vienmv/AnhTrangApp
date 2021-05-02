package com.linkin.model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class OrderDTO implements Serializable {
	private static final long serialVersionUID = 1L;
	public static int HAS_CONTRACT = 2;
	public static int NO_CONTRACT = 1;

	private Long id;
	private String description;
	private String unit;
	private Double weight;
	private String note;
	private Double realWeight;
	private Long price;
	private Integer status;
	private Long sellerId;
	private String sellerName;
	private Long shipperId;
	private String shipperName;
	private String createdDate;
	private String createdBy;
	private String updatedDate;
	private String customerName;
	private Long customerId;
	private Boolean hideOrder;
	private List<Long> shippers;
	private Boolean checkSendNoti;
	private Long cost;
	private String cityName;
	private String districtName;
	private String wardsName;
	private String review;
	private Integer starRating;
	private String address;
	private String phoneCustomer;
	
}
