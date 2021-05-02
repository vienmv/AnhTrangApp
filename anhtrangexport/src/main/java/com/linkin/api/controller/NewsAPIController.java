package com.linkin.api.controller;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.linkin.model.NewsDTO;
import com.linkin.model.ResponseDTO;
import com.linkin.model.SearchNewsDTO;
import com.linkin.service.NewsService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = -1)
public class NewsAPIController {

	@Autowired
	private NewsService newsService;

	@PostMapping(value = "/member/news")
	public ResponseDTO<NewsDTO> find(@RequestBody SearchNewsDTO searchNewsDTO) {
		ResponseDTO<NewsDTO> responseDTO = new ResponseDTO<NewsDTO>();
		responseDTO.setData(newsService.find(searchNewsDTO));
		responseDTO.setRecordsFiltered(newsService.count(searchNewsDTO));
		responseDTO.setRecordsTotal(newsService.countTotal(searchNewsDTO));
		return responseDTO;
	}

	@PostMapping("/admin/news/add")
	public @ResponseBody NewsDTO add(@RequestBody NewsDTO newsDTO) {
		newsService.add(newsDTO);
		return newsDTO;
	}

	@PutMapping("/admin/news/update")
	public void update(@RequestBody NewsDTO newsDTO) {
		newsService.update(newsDTO);
	}

	@DeleteMapping("/admin/news/delete/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		newsService.delete(id);
	}

	@DeleteMapping(value = "/admin/news/delete-multi/{ids}")
	public void del(@PathVariable(name = "ids") List<Long> ids) {
		for (Long id : ids) {
			try {
				newsService.delete(id);
			} catch (Exception e) {
				// DO NOTHING
			}
		}
	}

	@PostMapping("/admin/news/excel/export")
	public @ResponseBody String exportExcel(@RequestBody SearchNewsDTO searchNewsDTO) {
		searchNewsDTO.setStart(null);
		List<NewsDTO> newsDTOs = newsService.find(searchNewsDTO);

		// add date to name of exel file
		String fileName = "tinTuc.xlsx";

		System.out.println("Create file excel");
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("tinTuc");

		int rowNum = 0;
		Row firstRow = sheet.createRow(rowNum++);
		firstRow.createCell(0).setCellValue("id");
		firstRow.createCell(1).setCellValue("Thong Tin");
		firstRow.createCell(2).setCellValue("Tieu De");

		for (NewsDTO newsDTO : newsDTOs) {
			Row row = sheet.createRow(rowNum++);
			row.createCell(0).setCellValue(newsDTO.getId());
			row.createCell(1).setCellValue(newsDTO.getContent());
			row.createCell(2).setCellValue(newsDTO.getTitle());

		}
		try {
			FileOutputStream outputStream = new FileOutputStream(fileName);
			workbook.write(outputStream);
			workbook.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fileName;
	}

	@GetMapping("/member/news/{id}")
	public NewsDTO get(@PathVariable(name = "id") Long id) {
		return newsService.get(id);
	}
}
