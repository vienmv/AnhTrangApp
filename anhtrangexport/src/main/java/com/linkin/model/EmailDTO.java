package com.linkin.model;

import lombok.Data;

@Data
public class EmailDTO {
	public static final int TOPUP_MONEY = 1;
	public static final int WITHDRAW_MONEY = 2;
	public static final int CHARGE_CARD = 3;
	public static final int ACCOUNT = 4;
	
	private Long id;
	private String email;
	private Integer type;


}
