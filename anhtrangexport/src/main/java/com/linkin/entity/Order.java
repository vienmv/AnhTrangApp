package com.linkin.entity;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.LastModifiedDate;

import lombok.Data;

@Entity
@Table(name = "orders")
@Data
public class Order extends CreateAuditable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "unit")
	private String unit;// đơn vị tính kg, can, lit

	@Column(name = "weight")
	private Double weight;// cân nặng

	@Column(name = "description")
	private String description;// mô tả

	@Column(name = "note")
	private String note;// chú thích

	@Column(name = "real_weight")
	private Double realWeight;// trọng lượng thực

	@Column(name = "price")
	private Long price;// giá

	@Column(name = "status")
	private Integer status; // trạng thái 1: Moi, 2. Cho ship. 3: Hoan Thanh 4: Huy

	@Column(name = "hide_order")
	private Boolean hideOrder;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "seller_id")
	private User seller;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shipper_id")
	private User shipper;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_id")
	private User customer;

	@LastModifiedDate
	@Column(name = "updated_date")
	private Date updatedDate;

	@ElementCollection
	@CollectionTable(name = "shippers", joinColumns = @JoinColumn(name = "order_id"))
	private Set<Long> shippers;// ds shipper duoc chon

	@ElementCollection
	@CollectionTable(name = "orders_images")
	private List<String> images;
	
	@Column(name = "cost")
	private Long cost;// giá shipper
	
	@Column(name = "check_send_noti")
	private Boolean checkSendNoti;
	
	@Column(name = "review")
	private String review;
	
	@Column(name = "star_rating")
	private Integer starRating;
	
}
