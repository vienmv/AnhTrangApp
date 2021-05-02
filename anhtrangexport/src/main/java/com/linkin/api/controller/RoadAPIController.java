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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.linkin.model.ResponseDTO;
import com.linkin.model.RoadDTO;
import com.linkin.model.SearchRoadDTO;
import com.linkin.service.RoadService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = -1)
public class RoadAPIController {
	@Autowired
	private RoadService roadService;

	@PostMapping(value = "/shipper/road/search")
	public ResponseDTO<RoadDTO> find(@RequestBody SearchRoadDTO searchRoadDTO) {
		ResponseDTO<RoadDTO> responseDTO = new ResponseDTO<RoadDTO>();
		responseDTO.setData(roadService.find(searchRoadDTO));
		responseDTO.setRecordsFiltered(roadService.count(searchRoadDTO));
		responseDTO.setRecordsTotal(roadService.countTotal(searchRoadDTO));
		return responseDTO;
	}

	@PostMapping("/shipper/road/add")
	public @ResponseBody RoadDTO add(@RequestBody RoadDTO roadDTO) {
		roadService.add(roadDTO);
		return roadDTO;
	}

	@DeleteMapping("/shipper/road/delete/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		roadService.delete(id);
	}

	@DeleteMapping(value = "/shipper/road/delete-multi/{ids}")
	public void del(@PathVariable(name = "ids") List<Long> ids) {
		for (Long id : ids) {
			try {
				roadService.delete(id);
			} catch (Exception e) {
				// DO NOTHING
			}
		}
	}

	@PostMapping("/admin/road/excel/export")
	public @ResponseBody String exportExcel(@RequestBody SearchRoadDTO searchRoadDTO) {
		searchRoadDTO.setStart(null);
		List<RoadDTO> roadDTOs = roadService.find(searchRoadDTO);

		// add date to name of exel file
		String fileName = "cungDuong.xlsx";

		System.out.println("Create file excel");
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("cungDuong");

		int rowNum = 0;
		Row firstRow = sheet.createRow(rowNum++);
		firstRow.createCell(0).setCellValue("Id");
		firstRow.createCell(1).setCellValue("Tên Thành Phố");

		for (RoadDTO roadDTO : roadDTOs) {
			Row row = sheet.createRow(rowNum++);
			row.createCell(0).setCellValue(roadDTO.getId());
			row.createCell(1).setCellValue(roadDTO.getCityName());
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
}
