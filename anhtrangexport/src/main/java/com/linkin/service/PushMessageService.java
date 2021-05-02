package com.linkin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.linkin.model.PushMessageDTO;

public interface PushMessageService {
	void sendNotification(PushMessageDTO messageDTO);
}

@Service
class PushMessageServiceImp implements PushMessageService {

	@Autowired
	private RestTemplate restTemplate;

	@Override
	@Async
	public void sendNotification(PushMessageDTO messageDTO) {
		try {
			restTemplate.postForEntity("https://exp.host/--/api/v2/push/send", messageDTO, Object.class);
		} catch (Exception e) {
		}
	}

}