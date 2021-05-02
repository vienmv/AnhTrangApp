package com.linkin.service.impl;

import java.io.IOException;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.linkin.model.SMSDTO;
import com.linkin.service.SMSService;

@Service
public class SMSServiceImpl implements SMSService {

	@Async
	public void sendSMS(SMSDTO smsdto) {
		try {
			SpeedSMSAPI api  = new SpeedSMSAPI("c5dJoeANzhgraYjMqZ6gbGXoZ5Ms6k80");
			api.sendSMS(smsdto.getCustomerPhone(), smsdto.getContent(), 3, "ANH TRANG");
		} catch (IOException e) {
			System.err.println("SEND SMS error");
			System.out.println(e);
		}
	}

}
