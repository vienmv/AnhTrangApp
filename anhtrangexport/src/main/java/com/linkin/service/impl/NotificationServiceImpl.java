package com.linkin.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.linkin.dao.NotificationDao;
import com.linkin.dao.UserDao;
import com.linkin.entity.Notification;
import com.linkin.entity.User;
import com.linkin.model.NotificationDTO;
import com.linkin.model.PushMessageDTO;
import com.linkin.model.SearchNotificationDTO;
import com.linkin.service.NotificationService;
import com.linkin.service.PushMessageService;
import com.linkin.utils.DateTimeUtils;

@Transactional(value=TxType.REQUIRES_NEW)
@Service
public class NotificationServiceImpl implements NotificationService {

	@Autowired
	private NotificationDao notificationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private PushMessageService pushMessageService;

	@Override
	public void addNotification(NotificationDTO notificationDTO) {
		Notification notification = new Notification();
		BeanUtils.copyProperties(notificationDTO, notification);
		if (notificationDTO.getToUserId() != null) {
			User user = userDao.getById(notificationDTO.getToUserId());
			notification.setUser(user);
		}
		notificationDao.add(notification);
		notificationDTO.setId(notification.getId());

		if (notification.getUser().getDeviceId() != null) {
			this.sendNotificationToUser(notificationDTO,
					Arrays.asList(notification.getUser().getDeviceId().split(";")));
		}
	}

	@Override
	public void deleteNotification(Long id) {
		Notification notification = notificationDao.getById(id);
		if (notification != null) {
			notificationDao.delete(id);
		}
	}

	@Override
	public void updateReader(Long id, Long readerId) {
		Notification notification = notificationDao.getById(id);
		if (notification != null) {
			notification.getReaderIds().add(readerId);
			notificationDao.update(notification);
		}
	}

	@Override
	public List<NotificationDTO> findNotification(SearchNotificationDTO searchNotificationDTO) {
		List<NotificationDTO> notificationDTOs = new ArrayList<NotificationDTO>();
		List<Notification> notifications = notificationDao.find(searchNotificationDTO);
		notifications.forEach(notification -> {
			NotificationDTO notificationDTO = new NotificationDTO();
			BeanUtils.copyProperties(notification, notificationDTO);

			notificationDTO.setCreatedDate(
					DateTimeUtils.formatDate(notification.getCreatedDate(), DateTimeUtils.DD_MM_YYYY_HH_MM));
			notificationDTO.setTitle(notification.getTitle());
			notificationDTO.setReaderIds(new ArrayList<Long>(notification.getReaderIds()));
			notificationDTO.setToUserId(notification.getUser().getId());
			notificationDTO.setToUserPhone(notification.getUser().getPhone());
			notificationDTOs.add(notificationDTO);
		});
		return notificationDTOs;
	}

	@Override
	public Long countNotification(SearchNotificationDTO searchNotificationDTO) {
		return notificationDao.count(searchNotificationDTO);
	}

	@Override
	public Long countTotalNotification(SearchNotificationDTO searchNotificationDTO) {
		return notificationDao.countTotal(searchNotificationDTO);
	}

	private void sendNotificationToUser(NotificationDTO notificationDTO, List<String> playerIds) {
		PushMessageDTO messageDTO = new PushMessageDTO();
		for (String token : playerIds) {
			if (StringUtils.isNotBlank(token)) {
				messageDTO.setTitle(notificationDTO.getTitle());
				messageDTO.setBody(notificationDTO.getContent());
				messageDTO.setData(new PushMessageDTO.Data(notificationDTO.getType(), notificationDTO.getItem()));
				messageDTO.setTo(token);
				pushMessageService.sendNotification(messageDTO);
			}
		}
	}

}
