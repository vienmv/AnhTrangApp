package com.linkin.service;

import java.util.List;

import com.linkin.model.NotificationDTO;
import com.linkin.model.SearchNotificationDTO;

public interface NotificationService {

	void addNotification(NotificationDTO notificationDTO);

	void deleteNotification(Long id);

	List<NotificationDTO> findNotification(SearchNotificationDTO searchNotificationDTO);

	Long countNotification(SearchNotificationDTO searchNotificationDTO);
	
	Long countTotalNotification(SearchNotificationDTO searchNotificationDTO);
	
	void updateReader(Long id, Long readerId);

}
