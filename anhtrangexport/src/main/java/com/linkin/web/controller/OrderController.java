package com.linkin.web.controller;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.linkin.model.OrderDTO;
import com.linkin.model.SearchOrderDTO;
import com.linkin.service.OrderService;

@Controller
public class OrderController {

	@Autowired
	private OrderService orderService;

	@GetMapping(value = "/admin/order/list")
	public String agentOrderList(Model model) {
		return "admin/order/list-order";
	}

	@PostMapping("/admin/order/excel/export")
	public @ResponseBody String exportExcel(@RequestBody SearchOrderDTO searchOrderDTO) {
		// add date to name of exel file
		String fileName = "DonHang.xlsx";
		try {
			searchOrderDTO.setStart(null);
			List<OrderDTO> orderDTOs = orderService.find(searchOrderDTO);

			XSSFWorkbook workbook = new XSSFWorkbook();
			XSSFSheet sheet = workbook.createSheet("DonHang");

			int rowNum = 0;
			Row firstRow = sheet.createRow(rowNum++);
			Cell c0 = firstRow.createCell(0);
			c0.setCellValue("id");
			Cell c1 = firstRow.createCell(1);
			c1.setCellValue("Ngày Tạo");
			Cell c2 = firstRow.createCell(2);
			c2.setCellValue("Nhà cung cấp");
			Cell c3 = firstRow.createCell(3);
			c3.setCellValue("Số lượng NCC báo");
			Cell c4 = firstRow.createCell(4);
			c4.setCellValue("Số lượng Thực nhận");
			Cell c5 = firstRow.createCell(5);
			c5.setCellValue("Đơn vị");
			Cell c6 = firstRow.createCell(6);
			c6.setCellValue("Giá Thực nhận");
			Cell c7 = firstRow.createCell(7);
			c7.setCellValue("Tổng tiền hàng");
			Cell c8 = firstRow.createCell(8);
			c8.setCellValue("Giá ship");
			Cell c9 = firstRow.createCell(9);
			c9.setCellValue("Tổng tiền ship");
			Cell c10 = firstRow.createCell(10);
			c10.setCellValue("Mô tả");
			Cell c11 = firstRow.createCell(11);
			c11.setCellValue("Shipper");
			Cell c12 = firstRow.createCell(12);
			c12.setCellValue("Seller");
			Cell c13 = firstRow.createCell(13);
			c13.setCellValue("Trạng Thái");
			Cell c14 = firstRow.createCell(14);
			c14.setCellValue("Ghi Chú");
			Cell c15 = firstRow.createCell(15);
			c15.setCellValue("Ngày cập nhật");
			Cell c16 = firstRow.createCell(16);
			c16.setCellValue("Đơn ẩn");

			for (OrderDTO orderDTO : orderDTOs) {
				Row row = sheet.createRow(rowNum++);
				Cell cell0 = row.createCell(0);
				cell0.setCellValue(orderDTO.getId());
				Cell cell1 = row.createCell(1);
				cell1.setCellValue(orderDTO.getCreatedDate());
				Cell cell2 = row.createCell(2);
				cell2.setCellValue(orderDTO.getCustomerName());
				Cell cell3 = row.createCell(3);
				cell3.setCellValue(orderDTO.getWeight() == null ? 0 : orderDTO.getWeight());
				Cell cell4 = row.createCell(4);
				cell4.setCellValue(orderDTO.getRealWeight() == null ? 0 : orderDTO.getRealWeight());// cân nặng thực
				Cell cell5 = row.createCell(5);
				cell5.setCellValue(orderDTO.getUnit());
				Cell cell6 = row.createCell(6);
				cell6.setCellValue(orderDTO.getPrice() == null ? 0 : orderDTO.getPrice());
				Cell cell7 = row.createCell(7);
				cell7.setCellValue(orderDTO.getPrice() == null || orderDTO.getRealWeight() == null ? 0
						: orderDTO.getPrice() * orderDTO.getRealWeight());
				Cell cell8 = row.createCell(8);
				cell8.setCellValue(orderDTO.getCost() == null ? 0 : orderDTO.getCost());
				Cell cell9 = row.createCell(9);
				cell9.setCellValue(orderDTO.getCost() == null || orderDTO.getRealWeight() == null ? 0 : orderDTO.getCost() * orderDTO.getRealWeight());
				Cell cell10 = row.createCell(10);
				cell10.setCellValue(orderDTO.getDescription());
				Cell cell11 = row.createCell(11);
				cell11.setCellValue(orderDTO.getShipperName());
				Cell cell12 = row.createCell(12);
				cell12.setCellValue(orderDTO.getSellerName());
				Cell cell13 = row.createCell(13);
				cell13.setCellValue(getStatus(orderDTO.getStatus()));
				Cell cell14 = row.createCell(14);
				cell14.setCellValue((orderDTO.getNote()));
				Cell cell15 = row.createCell(15);
				cell15.setCellValue(orderDTO.getUpdatedDate());
				Cell cell16 = row.createCell(16);
				cell16.setCellValue(orderDTO.getHideOrder());

			}
			FileOutputStream outputStream = new FileOutputStream(fileName);
			workbook.write(outputStream);
			workbook.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return fileName;
	}

	public String getStatus(long status) {
		if (status == 1) {
			return "Mới";
		} else if (status == 2) {
			return "Chờ ship";
		} else if (status == 3) {
			return "Hoàn Thành";
		} else {
			return "Hủy";
		}
	}

}
