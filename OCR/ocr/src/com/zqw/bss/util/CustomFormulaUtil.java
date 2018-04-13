package com.zqw.bss.util;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.commons.lang.StringUtils;

import com.zqw.account.framework.exception.OperationException;

/**
 * 自定义公式
 * 
 * @author win7 张沂飞
 */
public class CustomFormulaUtil {

	/**
	 * 校验 设置的 自定义公式 是否合法 张沂飞
	 * 
	 * @param custom
	 */
	public static void checkCustomFormula(Map<String, Object> custom) {
		if (!custom.containsKey("inventoryQty") || custom.get("inventoryQty") == null
				|| "[]".equals(custom.get("inventoryQty").toString())) {
			throw new OperationException("您需要设置自定义库存数量公式");
		}
		if (!custom.containsKey("amount") || custom.get("amount") == null
				|| "[]".equals(custom.get("amount").toString())) {
			throw new OperationException("您需要设置自定义金额公式");
		}

		// 外箱尺寸 meas
		// 重量 weight
		// 单价 price
		// 每箱数量 eachCartons
		// 总箱数 totalCartons
		// 总数量 qty
		// 允许输入的字段
		String[] parameters = { "meas", "weight", "price", "eachCartons", "totalCartons", "qty", "inventoryQty", "+",
				"-", "*", "/", "(", ")" };
		@SuppressWarnings("unchecked")
		List<String> inventoryQtys = (List<String>) custom.get("inventoryQty");
		if (inventoryQtys.size() >= 30) {
			// 2017年11月24日 09:26:31 产品说 对客户来说符号不算公式
			throw new OperationException("抱歉,库存数量公式因子选择的太多了,最多15个哦");
		}

		@SuppressWarnings("unchecked")
		List<String> amounts = (List<String>) custom.get("amount");
		if (amounts.size() >= 30) {
			throw new OperationException("抱歉,金额公式因子选择的太多了,最多15个哦");
		}
		Boolean flag = false;
		@SuppressWarnings("unused")
		BigDecimal emp = BigDecimal.ZERO;
		for (String inventoryQty : inventoryQtys) {
			if ("inventoryQty".equals(inventoryQty)) {
				throw new OperationException("库存数量公式里面的参数不能有库存数量");
			}

			flag = false;
			for (String param : parameters) {
				if (param.equals(inventoryQty)) {
					flag = true;
					break;
				}
			}
			// 如果参数不是允许输入的参数就是自定义数字
			if (!flag) {
				if ("".equals(inventoryQty)) {
					throw new OperationException("库存数量公式里面的自定义数字不能是空字符串");
				}
				try {
					emp = new BigDecimal(inventoryQty);
				} catch (Exception e) {
					throw new OperationException("库存数量公式里面的自定义数字只能是数字");
				}
			}
		}

		// 是否有库存数量和总数量
		Boolean qtyOrInventoryQtyFlag = Boolean.FALSE;
		for (String amount : amounts) {
			flag = false;
			for (String param : parameters) {
				if (param.equals(amount)) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				if ("".equals(amount)) {
					throw new OperationException("金额公式里面的自定义数字不能是空字符串");
				}
				try {
					emp = new BigDecimal(amount);
				} catch (Exception e) {
					throw new OperationException("金额公式里面的自定义数字只能是数字");
				}
			}
		}

		// 使用随机数计算,看自定义公式是否可运行;
		randomCheckCustomFormula(custom, "inventoryQty");
		randomCheckCustomFormula(custom, "amount");
	}

	/**
	 * 使用随机数校验自定义公式 张沂飞
	 * 
	 * @param custom
	 * @param string
	 */
	private static void randomCheckCustomFormula(Map<String, Object> custom, String type) {
		Random ra = new Random();
		@SuppressWarnings("unchecked")
		List<String> formulaParam = (List<String>) custom.get(type);
		String formula = "";
		Map<String, Object> number = new HashMap<>();
		for (String param : formulaParam) {
			if (StringUtils.isNumeric(param)) {
				formula += param + " ";
			} else {
				formula += param + " ";
				number.put(param, ra.nextInt(10000) + 1);
			}
		}
		try {
			CalUtil.exec(formula, number);
		} catch (Exception e) {
			if ("inventoryQty".equals(type)) {
				throw new OperationException("库存数量自定义公式不合法");
			} else if ("amount".equals(type)) {
				throw new OperationException("金额自定义公式不合法");
			} else {
				throw new OperationException("自定义公式不合法");
			}
		}
	}



}
