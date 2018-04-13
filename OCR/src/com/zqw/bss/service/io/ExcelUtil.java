package com.zqw.bss.service.io;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;


public class ExcelUtil{
	// 以下创建各个不同表格的单元格样式
		public static Workbook createWBEquals(List<Map<String, Object>> listmap, String[] keys, String columnNames[],
				Map<String, String> titlemap) {
			Workbook wb = new HSSFWorkbook();
			Sheet sheet = wb.createSheet(listmap.get(0).get("sheetName").toString());
			for (int i = 0; i < keys.length; i++) {
				sheet.setColumnWidth((short) i, (short) (50 * 180));
			}
			// 创建第一行
			Row row = sheet.createRow((short) 0);
			// 创建两种单元格格式
			CellStyle cs = wb.createCellStyle();
			CellStyle cs2 = wb.createCellStyle();

			// 创建两种字体
			Font f = wb.createFont();
			Font f2 = wb.createFont();

			// 创建第一种字体样式（用于列名）
			f.setFontHeightInPoints((short) 10);
			f.setColor(IndexedColors.BLACK.getIndex());
			f.setBoldweight(Font.BOLDWEIGHT_BOLD);

			// 创建第二种字体样式（用于值）
			f2.setFontHeightInPoints((short) 10);
			f2.setColor(IndexedColors.BLACK.getIndex());

			// 设置第一种单元格的样式（用于列名）
			cs.setFont(f);
			cs.setBorderLeft(CellStyle.BORDER_THIN);
			cs.setBorderRight(CellStyle.BORDER_THIN);
			cs.setBorderTop(CellStyle.BORDER_THIN);
			cs.setBorderBottom(CellStyle.BORDER_THIN);
			cs.setAlignment(CellStyle.ALIGN_CENTER);
			cs.setVerticalAlignment(CellStyle.VERTICAL_CENTER);// 垂直方向的对齐方式

			// 设置第二种单元格的样式（用于值）
			CellStyle cellStyle = wb.createCellStyle();
			HSSFDataFormat format = (HSSFDataFormat) wb.createDataFormat();
			cellStyle.setDataFormat(format.getFormat("@")); // 设置为文本格式
			cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);// 水平方向的对齐方式
			cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直方向的对齐方式
			cellStyle.setBorderLeft(CellStyle.BORDER_THIN);
			cellStyle.setBorderRight(CellStyle.BORDER_THIN);
			cellStyle.setBorderTop(CellStyle.BORDER_THIN);
			cellStyle.setBorderBottom(CellStyle.BORDER_THIN);

			CellStyle cellStyle1 = wb.createCellStyle();
			cellStyle1.setAlignment(HSSFCellStyle.ALIGN_LEFT);// 水平方向的对齐方式
			cellStyle1.setVerticalAlignment(HSSFCellStyle.VERTICAL_TOP);// 垂直方向的对齐方式
			cellStyle1.setBorderLeft(CellStyle.BORDER_THIN);
			cellStyle1.setBorderRight(CellStyle.BORDER_THIN);
			cellStyle1.setBorderTop(CellStyle.BORDER_THIN);
			cellStyle1.setBorderBottom(CellStyle.BORDER_THIN);

			cs2.setFont(f2);
			cs2.setBorderLeft(CellStyle.BORDER_THIN);
			cs2.setBorderRight(CellStyle.BORDER_THIN);
			cs2.setBorderTop(CellStyle.BORDER_THIN);
			cs2.setBorderBottom(CellStyle.BORDER_THIN);
			cs2.setAlignment(CellStyle.ALIGN_JUSTIFY);

			// 设置列名
			for (int i = 0; i < columnNames.length; i++) {
				Cell cell = row.createCell(i);
				cell.setCellValue(columnNames[i]);
				cell.setCellStyle(cs);
			}
			// 设置每行每列的值
			for (short i = 1; i < listmap.size(); i++) {
				// Row 行,Cell 方格 , Row 和 Cell 都是从0开始计数的
				// 创建一行，在页sheet上
				Row row1 = sheet.createRow((short) i);

				// 在row行上创建一个方格
				for (short j = 0; j < keys.length; j++) {

					Cell cell = row1.createCell(j);
					cell.setCellValue(listmap.get(i).get(keys[j]) == null ? " " : listmap.get(i).get(keys[j]).toString());
					cell.setCellStyle(cellStyle);
				}
				row1 = column1(row1, cellStyle1, 0);
			}
			sheet = createTitle(titlemap, sheet, columnNames);
			for (int i = 0; i < listmap.size() + 2; i++) {
				sheet.getRow(i).setHeightInPoints((short) (23));
			}
			Font f3 = wb.createFont();
			f3.setFontHeightInPoints((short) 20);
			f3.setColor(IndexedColors.BLACK.getIndex());
			f3.setBoldweight(Font.BOLDWEIGHT_BOLD);
			CellStyle cellStyle3 = wb.createCellStyle();
			cellStyle3.setFont(f3);
			cellStyle3.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平方向的对齐方式
			cellStyle3.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直方向的对齐方式
			sheet.getRow(0).setHeightInPoints((short) (28));
			sheet.getRow(0).getCell(0).setCellValue(titlemap.get("fileName"));
			sheet.getRow(0).getCell(0).setCellStyle(cellStyle3);
			return wb;

		}
		
		// 调整第一列左对齐
		private static Row column1(Row row, CellStyle cellStyle, int i) {
			// 设置第二种单元格的样式（用于值）

			cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);// 水平方向的对齐方式
			cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_TOP);// 垂直方向的对齐方式
			cellStyle.setBorderLeft(CellStyle.BORDER_THIN);
			cellStyle.setBorderRight(CellStyle.BORDER_THIN);
			cellStyle.setBorderTop(CellStyle.BORDER_THIN);
			cellStyle.setBorderBottom(CellStyle.BORDER_THIN);
			row.getCell(i).setCellStyle(cellStyle);
			return row;
		}
		// 报表和账簿创建表头
		private static Sheet createTitle(Map<String, String> map, Sheet sheet, String columnNames[]) {
			if (map == null) {
				return sheet;
			}
			sheet.shiftRows(0, sheet.getLastRowNum(), 2, true, false);

			Row row01 = sheet.createRow(0);
			Row row02 = sheet.createRow(1);

			// 创建两种字体
			Font f = sheet.getWorkbook().createFont();
			Font f2 = sheet.getWorkbook().createFont();
			CellStyle cellStyle = sheet.getWorkbook().createCellStyle();
			CellStyle cellStyle2 = sheet.getWorkbook().createCellStyle();
			cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平方向的对齐方式
			cellStyle.setVerticalAlignment(HSSFCellStyle.ALIGN_CENTER);// 垂直方向的对齐方式
			cellStyle.setBorderLeft(CellStyle.BORDER_THIN);
			cellStyle.setBorderRight(CellStyle.BORDER_THIN);
			cellStyle.setBorderTop(CellStyle.BORDER_THIN);
			cellStyle.setBorderBottom(CellStyle.BORDER_THIN);

			cellStyle2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平方向的对齐方式
			cellStyle2.setVerticalAlignment(HSSFCellStyle.ALIGN_CENTER);// 垂直方向的对齐方式
			cellStyle2.setBorderLeft(CellStyle.BORDER_THIN);
			cellStyle2.setBorderRight(CellStyle.BORDER_THIN);
			cellStyle2.setBorderTop(CellStyle.BORDER_THIN);
			cellStyle2.setBorderBottom(CellStyle.BORDER_THIN);
			cellStyle2.setWrapText(true);

			// 加粗大字
			f.setFontHeightInPoints((short) 22);
			f.setColor(IndexedColors.BLACK.getIndex());
			f.setBoldweight(Font.BOLDWEIGHT_BOLD);
			// 小字
			f2.setFontHeightInPoints((short) 14);
			f2.setColor(IndexedColors.BLACK.getIndex());
			f2.setBoldweight(Font.BOLDWEIGHT_BOLD);
			cellStyle.setFont(f);
			cellStyle2.setFont(f2);

			Cell cell01 = null;
			Cell cell02 = null;
			int size = columnNames.length;

			for (int i = 0; i < size; i++) {
				cell01 = row01.createCell(i);
				cell02 = row02.createCell(i);
				cell01.setCellStyle(cellStyle2);
				cell02.setCellStyle(cellStyle2);
			}

			// 公司名
			Cell cell1 = row02.createCell(0);
			if (map.containsKey("com")) {
				cell1.setCellValue(map.get("com"));
				cell1.setCellStyle(cellStyle2);
			}
			// 表名
			Cell cell2 = row01.createCell(0);
			cell2.setCellValue(map.get("title"));
			cell2.setCellStyle(cellStyle);
			// 時間
			Cell cell3 = row02.createCell((columnNames.length - 1) / 2);
			cell3.setCellValue(map.get("time"));
			cell3.setCellStyle(cellStyle2);
			// // 會計準則表名
			// Cell cell4 = row02.createCell(3);
			// cell4.setCellValue(map.get("table"));
			// cell4.setCellStyle(cellStyle2);
			// 币种
			Cell cell5 = row02.createCell(columnNames.length - 2);
			cell5.setCellValue(map.get("money"));
			cell5.setCellStyle(cellStyle2);

			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columnNames.length - 1));
			// sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 1));
			if ((columnNames.length) % 2 == 0) {
				sheet.addMergedRegion(
						new CellRangeAddress(1, 1, (columnNames.length - 1) / 2, (columnNames.length - 1) / 2 + 1));
			}
			sheet.addMergedRegion(new CellRangeAddress(1, 1, columnNames.length - 2, columnNames.length - 1));
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 1));

			return sheet;
		}
		
		
}











