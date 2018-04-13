package com.zqw.bss.util;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import com.googlecode.aviator.AviatorEvaluator;
import com.googlecode.aviator.Expression;
import com.googlecode.aviator.Options;


public class CalUtil {
	static {
		AviatorEvaluator.setOption(Options.ALWAYS_USE_DOUBLE_AS_DECIMAL, true);
	}
	// 计算表达式,返回值是Double或者Long
	public static Object exec(String expression, Map<String, Object> params) {
		Expression compiledExp = AviatorEvaluator.compile(expression, true);
		return compiledExp.execute(params);
	}

	public static BigDecimal execBigDecimal(String expression, Map<String, Object> params) {
		Object exec = CalUtil.exec(expression, params);
		BigDecimal big = BigDecimal.ZERO;
		if (exec instanceof Double) {
			big = BigDecimal.valueOf( (Double) exec);
		} else if (exec instanceof Long) {
			big = BigDecimal.valueOf( (Long) exec);
		} else if (exec instanceof BigDecimal) {
			big = (BigDecimal) exec;
		}
		return big;
	}
	
	public static void main(String args[]) {
		System.out.println(CalUtil.execBigDecimal("3*3*-3", null));
	}
}
