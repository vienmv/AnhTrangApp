package com.linkin.model;

import java.util.List;

import lombok.Data;

@Data
public class SearchOrderDTO extends SearchDTO {

	private static final long serialVersionUID = 1L;
	private Long sellerId;
	private Long shipperId;
	private String sellerName;
	private String shiperName;
	private String fromDate;
	private String toDate;
	private String createdBy;
	private Long customerId;
	private String customerName;
	private Integer status;
	private Boolean hideOrder;
	private List<Integer> statusList;
	private String createdDate;
	private Boolean checkSendNoti;
	private String searchCity;

}
