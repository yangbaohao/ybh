package com.zqw.bss.vo.report;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;

public class PerformanceVO extends BaseObject{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 制单人字段
	 */
	//角色类型
	private String type;
	//员工
	private String username;
	//制单数量
	private Long total;
	//制单驳回次数
	private Long kfreject;
	//客户拒绝次数
	private Long checkRefused;
	//审核拒绝次数
	private Long checkFailed;
	//复核拒绝次数
	private Long checkAgainFailed;
	//客户撤销次数
	private Long khbackout;
	//暂时不用
	private Long orderSuccess;
	//暂时不用
	private Long orderSubmit;
	//平均制单时长
	private String avgTime;
	//平均制单产品数
	private BigDecimal detailQty;
	/**
	 * 审核人字段
	 */
	//审单数量
	private Long checkNumber;
	//审核拒绝单数
	private Long checkRefusedNumber;
	//复核拒绝单数
	private Long checkAgainRefusedNumber;
	//客户驳回单数
	private Long khrefusedNumber;
	//客户撤销单数
	private Long khbackOutNumber;
	//平均审单产品数
	private BigDecimal checkDetailQtyNumber;
	//平均审单时长
	private String checkTimeNumber;
	/**
	 * 审核人
	 */
	public PerformanceVO(Object[] array,Object[] array2){
		super();
		this.type="审核人";
		if(array[0]!=null){
			this.username =array[0].toString();
		}
		if(array[1]!=null){
			this.checkNumber =Long.valueOf(array[1].toString());
		}
		if(array[2]!=null){
			this.khrefusedNumber =Long.valueOf(array[2].toString());
		}
		if(array[3]!=null){
			this.checkRefusedNumber =Long.valueOf(array[3].toString());
		}
		if(array[4]!=null){
			this.checkAgainRefusedNumber =Long.valueOf(array[4].toString());
		}
		if(array[5]!=null){
			this.khbackOutNumber =Long.valueOf(array[5].toString());
		}
		if(array[6]!=null){
			this.checkTimeNumber =array[6].toString();
		}
		if(array[7]!=null){
			this.checkDetailQtyNumber =new BigDecimal(array[7].toString());
		}
	}
	/**
	 * 制单人 
	 */
	public PerformanceVO(Object[] array){
		super();
		this.type="制单人";
		if(array[0]!=null){
			this.username =array[0].toString();
		}
		if(array[1]!=null){
			this.total =Long.valueOf(array[1].toString());
		}
		if(array[2]!=null){
			this.kfreject =Long.valueOf(array[2].toString());
		}
		if(array[3]!=null){
			this.checkRefused =Long.valueOf(array[3].toString());
		}
		if(array[4]!=null){
			this.checkFailed =Long.valueOf(array[4].toString());
		}
		if(array[5]!=null){
			this.checkAgainFailed =Long.valueOf(array[5].toString());
		}
		if(array[6]!=null){
			this.khbackout =Long.valueOf(array[6].toString());
		}
		if(array[7]!=null){
			this.orderSuccess =Long.valueOf(array[7].toString());
		}
		if(array[8]!=null){
			this.orderSubmit =Long.valueOf(array[8].toString());
		}
		if(array[9]!=null){
			this.avgTime =array[9].toString();
		}
		if(array[10]!=null){
			this.detailQty =new BigDecimal((array[10].toString()));
		}
	}
	
	
	
	@Override
	public boolean equals(Object arg0) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return 0;
	}
	
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Long getTotal() {
		return total;
	}
	public void setTotal(Long total) {
		this.total = total;
	}
	public Long getCheckRefused() {
		return checkRefused;
	}
	public void setCheckRefused(Long checkRefused) {
		this.checkRefused = checkRefused;
	}
	public Long getCheckFailed() {
		return checkFailed;
	}
	public void setCheckFailed(Long checkFailed) {
		this.checkFailed = checkFailed;
	}
	public Long getCheckAgainFailed() {
		return checkAgainFailed;
	}
	public void setCheckAgainFailed(Long checkAgainFailed) {
		this.checkAgainFailed = checkAgainFailed;
	}
	public Long getOrderSuccess() {
		return orderSuccess;
	}
	public void setOrderSuccess(Long orderSuccess) {
		this.orderSuccess = orderSuccess;
	}
	public Long getOrderSubmit() {
		return orderSubmit;
	}
	public void setOrderSubmit(Long orderSubmit) {
		this.orderSubmit = orderSubmit;
	}
	public String getAvgTime() {
		return avgTime;
	}
	public void setAvgTime(String avgTime) {
		this.avgTime = avgTime;
	}
	public BigDecimal getDetailQty() {
		return detailQty;
	}
	public void setDetailQty(BigDecimal detailQty) {
		this.detailQty = detailQty;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Long getCheckNumber() {
		return checkNumber;
	}
	public void setCheckNumber(Long checkNumber) {
		this.checkNumber = checkNumber;
	}
	public Long getCheckRefusedNumber() {
		return checkRefusedNumber;
	}
	public void setCheckRefusedNumber(Long checkRefusedNumber) {
		this.checkRefusedNumber = checkRefusedNumber;
	}
	public Long getCheckAgainRefusedNumber() {
		return checkAgainRefusedNumber;
	}
	public void setCheckAgainRefusedNumber(Long checkAgainRefusedNumber) {
		this.checkAgainRefusedNumber = checkAgainRefusedNumber;
	}
	public BigDecimal getCheckDetailQtyNumber() {
		return checkDetailQtyNumber;
	}
	public void setCheckDetailQtyNumber(BigDecimal checkDetailQtyNumber) {
		this.checkDetailQtyNumber = checkDetailQtyNumber;
	}
	public String getCheckTimeNumber() {
		return checkTimeNumber;
	}
	public void setCheckTimeNumber(String checkTimeNumber) {
		this.checkTimeNumber = checkTimeNumber;
	}
	public Long getKfreject() {
		return kfreject;
	}
	public void setKfreject(Long kfreject) {
		this.kfreject = kfreject;
	}
	public Long getKhbackout() {
		return khbackout;
	}
	public void setKhbackout(Long khbackout) {
		this.khbackout = khbackout;
	}
	public Long getKhrefusedNumber() {
		return khrefusedNumber;
	}
	public void setKhrefusedNumber(Long khrefusedNumber) {
		this.khrefusedNumber = khrefusedNumber;
	}
	public Long getKhbackOutNumber() {
		return khbackOutNumber;
	}
	public void setKhbackOutNumber(Long khbackOutNumber) {
		this.khbackOutNumber = khbackOutNumber;
	}

	
	
	
}
