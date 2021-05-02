package com.linkin.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.linkin.model.NotificationDTO;
import com.linkin.model.ResponseDTO;
import com.linkin.model.SearchNotificationDTO;
import com.linkin.model.UserPrincipal;
import com.linkin.service.NotificationService;
import com.linkin.utils.NotificationEnum;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = -1)
public class UserNotificationAPIController {

	@Autowired
	private NotificationService notificationService;

	@PostMapping(value = "/member/notifications")
	public ResponseDTO<NotificationDTO> finds(@RequestBody SearchNotificationDTO searchNotificationDTO) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		searchNotificationDTO.setUserId(currentUser.getId());

		ResponseDTO<NotificationDTO> responseDTO = new ResponseDTO<>();
		responseDTO.setData(notificationService.findNotification(searchNotificationDTO));
		responseDTO.setRecordsFiltered(notificationService.countNotification(searchNotificationDTO));
		responseDTO.setRecordsTotal(notificationService.countTotalNotification(searchNotificationDTO));
		return responseDTO;

	}

	@PostMapping(value = "/admin/notifications")
	public ResponseDTO<NotificationDTO> findAdmin(@RequestBody SearchNotificationDTO searchNotificationDTO) {
		ResponseDTO<NotificationDTO> responseDTO = new ResponseDTO<>();
		responseDTO.setData(notificationService.findNotification(searchNotificationDTO));
		responseDTO.setRecordsFiltered(notificationService.countNotification(searchNotificationDTO));
		responseDTO.setRecordsTotal(notificationService.countTotalNotification(searchNotificationDTO));
		return responseDTO;

	}

	@PutMapping("/member/notification")
	public @ResponseBody NotificationDTO update(@RequestBody NotificationDTO notificationDTO) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		notificationService.updateReader(notificationDTO.getId(), currentUser.getId());
		return notificationDTO;
	}

	@DeleteMapping(value = "/admin/notification/delete/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		notificationService.deleteNotification(id);
	}

	@DeleteMapping(value = "/admin/notification/delete-multi/{ids}")
	public void delStorage(@PathVariable(name = "ids") List<Long> ids) {
		for (Long id : ids) {
			try {
				notificationService.deleteNotification(id);
			} catch (Exception e) {
				// DO NOTHING
			}
		}
	}

	@PostMapping("/admin/notification/add")
	public NotificationDTO add(@RequestBody NotificationDTO notificationDTO) {
		notificationDTO.setType(NotificationEnum.GENERAL.name());
		try {
			notificationService.addNotification(notificationDTO);
		} catch (Exception e) {

		}
		return notificationDTO;
	}
}
