package com.linkin.model;

import com.linkin.utils.NotificationEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class PushMessageDTO {
	private String title;
	private String body;
	private String to;
	private String sound = "default";
	private String priority = "high";
	private String channelId = "notification";
	private Data data;
	private boolean _displayInForeground = true;

	@Setter
	@Getter
	@AllArgsConstructor
	public static class Data {
		private String type = NotificationEnum.GENERAL.name();
		private String item;
	}
}
