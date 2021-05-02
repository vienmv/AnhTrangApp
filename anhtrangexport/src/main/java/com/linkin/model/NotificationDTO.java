package com.linkin.model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class NotificationDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String title;
	private String content;
	private String createdDate;
	private List<Long> readerIds;
	private Long toUserId;
	private String toUserPhone;
	private String type;
	private String item;

}
