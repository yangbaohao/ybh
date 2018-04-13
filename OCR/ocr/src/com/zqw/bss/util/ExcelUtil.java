package com.zqw.bss.util;

import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressList;

/**
 * 导出Excel文档工具类
 * 
 * @author GuanZhengWei
 * @date 2014-8-6
 */
public class ExcelUtil {

	/**
	 * 创建excel文档，
	 * 
	 * @param list
	 *            数据
	 * @param keys
	 *            list中map的key数组集合
	 * @param columnNames
	 *            excel的列名
	 */
	public static Workbook createWorkBook(List<Map<String, Object>> list, String[] keys, String columnNames[]) {
		// 创建excel工作簿
		Workbook wb = new HSSFWorkbook();
		// 创建第一个sheet（页），并命名
		Sheet sheet = wb.createSheet(list.get(0).get("sheetName").toString());
		// 手动设置列宽。第一个参数表示要为第几列设；，第二个参数表示列的宽度，n为列高的像素数。
		for (int i = 0; i < keys.length; i++) {
			sheet.setColumnWidth((short) i, (short) (45 * 180));
		} 
		
//		sheet.addMergedRegion(new CellRangeAddress(1,1,1,2));

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

		// Font f3=wb.createFont();
		// f3.setFontHeightInPoints((short) 10);
		// f3.setColor(IndexedColors.RED.getIndex());

		// 设置第一种单元格的样式（用于列名）
		cs.setFont(f);
		cs.setBorderLeft(CellStyle.BORDER_THIN);
		cs.setBorderRight(CellStyle.BORDER_THIN);
		cs.setBorderTop(CellStyle.BORDER_THIN);
		cs.setBorderBottom(CellStyle.BORDER_THIN);
		cs.setAlignment(CellStyle.ALIGN_CENTER);

		// 设置第二种单元格的样式（用于值）
		CellStyle cellStyle =  wb.createCellStyle();
		 cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);// 水平方向的对齐方式
		 cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_TOP);// 垂直方向的对齐方式
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
		Row row2=null;
		for (short i = 1; i < list.size(); i++) {
			// Row 行,Cell 方格 , Row 和 Cell 都是从0开始计数的
			// 创建一行，在页sheet上
			Row row1 = sheet.createRow((short) i);
			
			
			// 在row行上创建一个方格
			for (short j = 0; j < keys.length; j++) {
				Cell cell = row1.createCell(j);
				cell.setCellValue(list.get(i).get(keys[j]) == null ? " " : list.get(i).get(keys[j]).toString());
				cell.setCellStyle(cellStyle);
			}
			//屏蔽合并单元格
/*			if(i==1){
				row2=row1;
			}
			
		   if( row1.getCell(8).getStringCellValue().equals(row2.getCell(8).getStringCellValue())&&i!=1){
			   sheet.addMergedRegion(new CellRangeAddress(i-1,i,0,0));
			   sheet.addMergedRegion(new CellRangeAddress(i-1,i,1,1));
				sheet.addMergedRegion(new CellRangeAddress(i-1,i,2,2));
				sheet.addMergedRegion(new CellRangeAddress(i-1,i,3,3));
				sheet.addMergedRegion(new CellRangeAddress(i-1,i,7,7));
		   }
		   row2=row1;*/
		  
		
		}
		/*for(int i=0;i<sheet.getLastRowNum();i++){
			 sheet.getRow(i).getCell(8).setCellValue("");
		}
		sheet.getRow(sheet.getLastRowNum()).getCell(8).setCellValue("");*/
		return wb;
	}


	// 导出用户
		// 以下创建各个不同表格的单元格样式
		public static Workbook createWBUser(List<Map<String, Object>> listmap, String[] keys, String columnNames[],
				Map<String, String> titlemap) {
			Workbook wb = new HSSFWorkbook();
			Sheet sheet = wb.createSheet(listmap.get(0).get("sheetName").toString());
			for (int i = 0; i < keys.length; i++) {
				sheet.setColumnWidth((short) i, (short) (35 * 180));
			}

			// 创建第一行
			Row row = sheet.createRow((short) 0);
			sheet.setColumnWidth(0, (short) (35 * 180));
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

			// Font f3=wb.createFont();
			// f3.setFontHeightInPoints((short) 10);
			// f3.setColor(IndexedColors.RED.getIndex());

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
			cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);// 水平方向的对齐方式
			cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_TOP);// 垂直方向的对齐方式
			CellStyle cellStyle1 = wb.createCellStyle();
			cellStyle1.setAlignment(HSSFCellStyle.ALIGN_LEFT);// 水平方向的对齐方式
			cellStyle1.setVerticalAlignment(HSSFCellStyle.VERTICAL_TOP);// 垂直方向的对齐方式
			cs2.setFont(f2);
			cs2.setBorderLeft(CellStyle.BORDER_THIN);
			cs2.setBorderRight(CellStyle.BORDER_THIN);
			cs2.setBorderTop(CellStyle.BORDER_THIN);
			cs2.setBorderBottom(CellStyle.BORDER_THIN);
			cs2.setAlignment(CellStyle.ALIGN_JUSTIFY);

			CellStyle style = wb.createCellStyle();
			style.setFillForegroundColor(IndexedColors.RED.getIndex());
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);
			style.setAlignment(HSSFCellStyle.ALIGN_RIGHT);// 水平方向的对齐方式
			style.setVerticalAlignment(HSSFCellStyle.VERTICAL_TOP);// 垂直方向的对齐方式
			style.setBorderLeft(CellStyle.BORDER_THIN);
			style.setBorderRight(CellStyle.BORDER_THIN);
			style.setBorderTop(CellStyle.BORDER_THIN);
			style.setBorderBottom(CellStyle.BORDER_THIN);

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
					row1 = column1(row1, cellStyle1, 0);
				}

			}
			sheet.getRow(0).getCell(0).setCellStyle(style);
			sheet.getRow(0).getCell(1).setCellStyle(style);
			sheet.getRow(0).getCell(2).setCellStyle(style);
			sheet.getRow(0).getCell(3).setCellStyle(style);
			sheet.getRow(0).getCell(4).setCellStyle(style);
			sheet.getRow(0).getCell(6).setCellStyle(style);
			sheet.getRow(0).getCell(7).setCellStyle(style);
			sheet.shiftRows(0, sheet.getLastRowNum(), 2, true, false);
			Cell titleCell = sheet.getRow(0).createCell(0);
			titleCell.setCellStyle(cellStyle1);
			titleCell.setCellValue("*1.导入本表时请确保导入行的红色标注列填写正确，密码6-20位。");
			Cell titleCell2 = sheet.getRow(1).createCell(0);
			titleCell2.setCellStyle(cellStyle1);
			titleCell2.setCellValue("*2.角色：系统管理员,代理商,销售人员,客服,销售主管,客服主管,二级销售主管,二级客服主管,贷款审核人。");

			String[] enable = { "男", "女" };
			String[] direct = { "是", "否" };

			sheet.addValidationData(addLimit(direct, 2, 1000, 7, 7));
			sheet.addValidationData(addLimit(enable, 2, 1000, 3, 3));
			sheet = createTitle(titlemap, sheet, columnNames);

			return wb;

		}

		@SuppressWarnings("unused")
		private static HSSFDataValidation addLimit(String[] list, int firstRow, int endRow, int firstCol, int endCol) {

			DVConstraint constraint = DVConstraint.createExplicitListConstraint(list);

			CellRangeAddressList regions = new CellRangeAddressList(firstRow, endRow, firstCol, endCol);
			// 数据有效性对象
			HSSFDataValidation data_validation_list = new HSSFDataValidation(regions, constraint);
			return data_validation_list;
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
}