/*用户信息*/
INSERT INTO t_crm_user_info (id,createBy,createDate,email,lastUpdateBy,lastUpdateDate,NAME,ownerId,telephone) VALUES ('-3', 'ocradmin', NOW(), '1353254@qq.com', 'ocradmin', NOW(), '上海益萃网络科技有限公司', -2, '12345678910');
INSERT INTO t_crm_user_info (id,createBy,createDate,email,lastUpdateBy,lastUpdateDate,NAME,ownerId,telephone) VALUES ('-4', 'ocradmin', NOW(), '15485748@qq.com', 'ocradmin', NOW(), '刘天雅', -2, '13576448945');

/*企业用户*/
INSERT INTO t_crm_enterprise_info (fax,registerTime,serviceInfo,shortName,taxCode,zipCode,id,enterpriseBiz,enterpriseType) VALUES ('13254511540', NOW(), '服务信息', '精品', '1511122', '200000', '-3','经营范围','软件开发公司');

/*个人用户*/
INSERT INTO t_crm_person_info (qq,salutation,id,enterpriseInfo_id) VALUES('43546845211','女','-4','-3');

/*用户信息*/
INSERT  INTO t_bss_sys_user(id,createBy,createDate,lastUpdateBy,lastUpdateDate,locked,PASSWORD,username,ownerId,organization_id,userInfo_id) VALUES(-1,'ocradmin',NOW(),NULL,NULL,'N','0ce4ddefa26da04a4528046f2cda9eb8','ocradmin',-2,NULL,-4);


insert into `t_crm_owner` (`id`, `agentCode`, `auditFlag`, `auditFunctions`, `balance`, `category1`, `category1Flag`, `category2`, `category2Flag`, `createBy`, `createDate`, `currency`, `dataFlag`, `dataFunctions`, `deliveryFlag`, `employeeCode`, `lastUpdateBy`, `lastUpdateDate`, `locked`, `loginId`, `producttypeFlag`, `productunitFlag`, `regEmail`, `regName`, `regTelephone`, `salesType`, `validDatetime`, `vat`, `enterpriseInfo_id`, `hangyeFlag0`, `hangyeFlag1`, `hangyeFlag2`, `hangyeFlag3`, `hangyeFlag4`, `hangyeFlag5`, `hangyeFlag6`, `hangyeFlag7`, `hangyeFlag8`, `hangyeFlag9`, `productBoxFlag`, `productCoLorFlag`, `productKgFlag`, `productNumberFlag`, `productSpeFlag`, `printTermFlag`, `productSpeTypeFlag`, `productCoLorTypeFlag`, `printPictureFlag`, `productMeasFlag`, `salesmanExamineFlag`, `printTermContent`, `shortcutBilling`, `blueTooth`, `lebal`, `customerCode`, `agent_id`, `sales_id`, `hangyeFlag10`, `englishFlagForBatch`, `printNameNoFlagForBatch`, `printPictureFlagForBatch`, `printPriceFlagForBatch`, `printProductFeeFlagForBatch`, `printWeightFlagForBatch`, `printItemForBatch`) values('-2',NULL,'N','',NULL,NULL,'N',NULL,'N','ocradmin','2016-07-14 11:07:06','RMB',NULL,NULL,NULL,NULL,'ocradmin','2016-07-14 11:07:22','N','ocradmin','N','N','12313@dwabj.com','dbadnka','12346345435','salesDirect','2016-07-14 11:08:23',NULL,'-3',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'N',NULL,NULL,'N',NULL,'N','N',NULL,'N','N',NULL,'N',NULL,NULL,NULL,NULL,NULL,'N','N','N','Y','Y','Y','N',NULL);

/*资源*/
INSERT INTO t_bss_sys_resource_info(createBy,createDate,id,parentId,NAME,TYPE,available,content,permission,LEVEL,indexNum) VALUES('ocradmin',NOW(),77,1,'总览','menu','Y','prom','all:look:look',1,NULL);
INSERT INTO t_bss_sys_resource_info(createBy,createDate,id,parentId,NAME,TYPE,available,content,permission,LEVEL,indexNum) VALUES('ocradmin',NOW(),78,1,'用户管理','menu','Y','prom','ocruser:ocruser:ocruser',1,NULL);
INSERT INTO t_bss_sys_resource_info(createBy,createDate,id,parentId,NAME,TYPE,available,content,permission,LEVEL,indexNum) VALUES('ocradmin',NOW(),79,1,'业绩报表','menu','Y','prom','ocrreport:ocrreport:ocrreport',1,NULL);
INSERT INTO t_bss_sys_resource_info(createBy,createDate,id,parentId,NAME,TYPE,available,content,permission,LEVEL,indexNum) VALUES('ocradmin',NOW(),80,1,'员工管理','menu','Y','prom','ocrperson:ocrperson:ocrperson',1,NULL);
INSERT INTO t_bss_sys_resource_info(createBy,createDate,id,parentId,NAME,TYPE,available,content,permission,LEVEL,indexNum) VALUES('ocradmin',NOW(),81,1,'业务日志','menu','Y','prom','ocrlog:ocrlog:ocrlog',1,NULL);
INSERT INTO t_bss_sys_resource_info(createBy,createDate,id,parentId,NAME,TYPE,available,content,permission,LEVEL,indexNum) VALUES('ocradmin',NOW(),82,77,'审核销售单','function','Y','auditor','auditor:auditor:auditor',3,NULL);
INSERT INTO t_bss_sys_resource_info(createBy,createDate,id,parentId,NAME,TYPE,available,content,permission,LEVEL,indexNum) VALUES('ocradmin',NOW(),83,77,'编辑销售单','function','Y','Ocrupdate','Ocrupdate:Ocrupdate:Ocrupdate',3,NULL);

/*角色资源*/
INSERT  INTO t_bss_sys_role_info(id,available,createBy,createDate,description,lastUpdateBy,lastUpdateDate,roleName,roleNameCN) VALUES(13,'Y','ocradmin','2015-03-02 16:40:37','OCR系统管理员','ocradmin',NOW(),'Ocr_Admin','OCR系统管理员');
INSERT  INTO t_bss_sys_role_info(id,available,createBy,createDate,description,lastUpdateBy,lastUpdateDate,roleName,roleNameCN) VALUES(14,'Y','ocradmin','2015-03-02 16:40:37','制单人','ocradmin',NOW(),'Ocr_createBy','制单人');
INSERT  INTO t_bss_sys_role_info(id,available,createBy,createDate,description,lastUpdateBy,lastUpdateDate,roleName,roleNameCN) VALUES(15,'Y','ocradmin','2015-03-02 16:40:37','审核人','ocradmin',NOW(),'Ocr_auditor','审核人');

/*Ocr管理员*/
INSERT INTO t_bss_roleresource_info VALUES(13,1);
INSERT INTO t_bss_roleresource_info VALUES(13,77);
INSERT INTO t_bss_roleresource_info VALUES(13,78);
INSERT INTO t_bss_roleresource_info VALUES(13,79);
INSERT INTO t_bss_roleresource_info VALUES(13,80);
INSERT INTO t_bss_roleresource_info VALUES(13,81);
INSERT INTO t_bss_roleresource_info VALUES(13,82);
INSERT INTO t_bss_roleresource_info VALUES(13,83);

INSERT INTO t_bss_roleresource_info VALUES(14,77);
INSERT INTO t_bss_roleresource_info VALUES(14,82);

INSERT INTO t_bss_roleresource_info VALUES(15,77);
INSERT INTO t_bss_roleresource_info VALUES(15,83);


INSERT INTO t_bss_userrole_info (userid,roleid) VALUES ('-1', '13'); 

