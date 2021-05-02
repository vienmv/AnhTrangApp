package com.linkin.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.linkin.dao.NewsDao;
import com.linkin.dao.UserGroupDao;
import com.linkin.entity.News;
import com.linkin.entity.UserGroup;
import com.linkin.entity.UserGroupUser;
import com.linkin.model.NewsDTO;
import com.linkin.model.PushMessageDTO;
import com.linkin.model.SearchNewsDTO;
import com.linkin.service.NewsService;
import com.linkin.service.PushMessageService;
import com.linkin.utils.DateTimeUtils;
import com.linkin.utils.NotificationEnum;

@Service
@Transactional
public class NewsServiceImpl implements NewsService {

	@Autowired
	private NewsDao newsDao;

	@Autowired
	private UserGroupDao userGroupDao;

	@Autowired
	private PushMessageService pushMessageService;

	@Override
	public void add(NewsDTO newsDTO) {
		News news = new News();
		news.setContent(newsDTO.getContent());
		news.setTitle(newsDTO.getTitle());
		
		UserGroup userGroup = userGroupDao.get(newsDTO.getUserGroupId());
		news.setUserGroup(userGroup);

		newsDao.add(news);
		newsDTO.setId(news.getId());

		for (UserGroupUser userGroupUser : userGroup.getUserGroupUsers()) {
			PushMessageDTO pushMessageDTO = new PushMessageDTO();
			pushMessageDTO.setTitle(newsDTO.getTitle());
			pushMessageDTO.setBody(newsDTO.getContent());
			pushMessageDTO
					.setData(new PushMessageDTO.Data(NotificationEnum.NEWS.name(), String.valueOf(newsDTO.getId())));

			if (userGroupUser.getUser().getDeviceId() != null) {
				for (String deviceId :userGroupUser.getUser().getDeviceId().split(";")) {
					pushMessageDTO.setTo(deviceId);
					pushMessageService.sendNotification(pushMessageDTO);
				}
			}
		}
	}

	@Override
	public void delete(Long id) {
		News news = newsDao.get(id);
		if (news != null) {
			newsDao.delete(news);
		}

	}

	@Override
	public void deleteAll() {
		newsDao.deleteAll();

	}

	@Override
	public void update(NewsDTO newsDTO) {
		News news = newsDao.get(newsDTO.getId());
		if (news != null) {
			news.setContent(newsDTO.getContent());
			news.setTitle(newsDTO.getTitle());
			news.setUserGroup(new UserGroup(newsDTO.getUserGroupId()));

			newsDao.update(news);
		}

	}

	@Override
	public List<NewsDTO> find(SearchNewsDTO searchNewsDTO) {
		List<News> newList = newsDao.find(searchNewsDTO);
		List<NewsDTO> newsDTOs = new ArrayList<NewsDTO>();
		newList.forEach(news -> {
			newsDTOs.add(convertToDTO(news));
		});
		return newsDTOs;
	}

	private NewsDTO convertToDTO(News news) {
		NewsDTO newDTO = new NewsDTO();

		newDTO.setId(news.getId());
		newDTO.setTitle(news.getTitle());
		newDTO.setContent(news.getContent());
		newDTO.setUserGroupId(news.getUserGroup().getId());
		newDTO.setUserGroupName(news.getUserGroup().getName());
		newDTO.setCreatedDate(DateTimeUtils.formatDate(news.getCreatedDate(), DateTimeUtils.DD_MM_YYYY_HH_MM));
		
		return newDTO;
	}

	@Override
	public Long count(SearchNewsDTO searchNewsDTO) {
		return newsDao.count(searchNewsDTO);
	}

	@Override
	public Long countTotal(SearchNewsDTO searchNewsDTO) {
		return newsDao.countTotal(searchNewsDTO);
	}

	@Override
	public NewsDTO get(Long id) {
		News news = newsDao.get(id);
		if (news != null) {
			return convertToDTO(news);
		}
		return null;
	}

}
