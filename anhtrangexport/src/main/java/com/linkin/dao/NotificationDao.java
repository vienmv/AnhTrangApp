package com.linkin.dao;

import java.util.List;

import com.linkin.entity.Notification;
import com.linkin.model.SearchNotificationDTO;

public interface NotificationDao {

	void add(Notification notification);

	void update(Notification notification);

	void delete(Long id);

	Notification getById(Long id);

	List<Notification> find(SearchNotificationDTO searchNotificationDTO);

	Long count(SearchNotificationDTO searchNotificationDTO);

	Long countTotal(SearchNotificationDTO searchNotificationDTO);
}
