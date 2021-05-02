package com.linkin.schedul;

import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.linkin.model.NotificationDTO;
import com.linkin.model.OrderDTO;
import com.linkin.model.SearchOrderDTO;
import com.linkin.service.NotificationService;
import com.linkin.service.OrderService;
import com.linkin.utils.DateTimeUtils;
import com.linkin.utils.NotificationEnum;
import com.linkin.utils.SMSMessage;

@Component
public class MessageTaskScheduler {

	@Autowired
	private NotificationService notificationService;

	@Autowired
	private OrderService orderService;

	@Scheduled(fixedDelay = 60000 * 60) // 1h
	public void sendExamRemind() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.HOUR, -5);

		SearchOrderDTO searchOrderDTO = new SearchOrderDTO();
		searchOrderDTO.setStart(null);
		searchOrderDTO.setStatusList(Arrays.asList(1, 2));
		searchOrderDTO.setCheckSendNoti(false);
		searchOrderDTO.setCreatedDate(DateTimeUtils.formatDate(calendar.getTime(), DateTimeUtils.DD_MM_YYYY_HH_MM));
		List<OrderDTO> orderDTOs = orderService.find(searchOrderDTO);

		for (OrderDTO orderDTO : orderDTOs) {
			// send notification
			NotificationDTO notificationDTO = new NotificationDTO();
			notificationDTO.setTitle(SMSMessage.title);
			notificationDTO.setToUserId(orderDTO.getCustomerId());
			notificationDTO.setContent(SMSMessage.NHA_CUNG_CAP_REMINDER);
			notificationDTO.setType(NotificationEnum.REMINDER.name());
			notificationDTO.setItem("0943949083");
			try {
				notificationService.addNotification(notificationDTO);
			} catch (Exception e) {
			}
			orderDTO.setCheckSendNoti(true);
			orderService.updateCheckSendNoti(orderDTO);
		}

	}
}
