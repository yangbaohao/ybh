package com.zqw.bss.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.springframework.context.annotation.Condition;

import com.zqw.bss.framework.vo.BasePagerObject;


/**
 * 
 * @author win7 张沂飞 处理特殊符号 在特殊符号前面加\\转义符
 */
public class SymbolUtil {
	/**
	 * 处理特殊字符BasePagerObject 张沂飞
	 * 
	 * @param str
	 * @return
	 */
	public static BasePagerObject disposeBasePagerObject(BasePagerObject bso) {
		List<com.zqw.bss.framework.vo.Condition> conditions = bso.getCondition();
		List<com.zqw.bss.framework.vo.Condition> conditionsEmp=new ArrayList<>();
		for (com.zqw.bss.framework.vo.Condition condition : conditions) {
			String[] value = condition.getValue();
			for (int i = 0; i < value.length; i++) {
				value[i]=SymbolUtil.dispose(value[i]);
			}
			condition.setValue(value);
			conditionsEmp.add(condition);
		}
		bso.setCondition(conditionsEmp);
		return bso;
	}

	/**
	 * 处理特殊字符 张沂飞
	 * 
	 * @param str
	 * @return
	 */
	public static String dispose(String str) {
		if (StringUtils.isNotBlank(str)) {
			String[] fbsArr = { "\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|", "~", "!", "@",
					"#", "%", "^", "&", "_", "=", "`", ":", ";", "\"", "'", "<", ">", "/" };
			for (String key : fbsArr) {
				if (str.contains(key)) {
					str = str.replace(key, "\\\\" + key);
				}
			}
		}
		return str;
	}

	public static void main(String[] args) {
		String[] fbsArr = { "\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|" };
		for (String string : fbsArr) {
			String dispose = SymbolUtil.dispose(string);
			System.out.println(dispose);
		}
	}

}
