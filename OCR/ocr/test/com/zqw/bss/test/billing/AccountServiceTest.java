package com.zqw.bss.test.billing;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.test.ServiceTestCase;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class AccountServiceTest extends ServiceTestCase{
	
	@Before
	public void setUp() throws Exception {

	}

	@After
	public void tearDown() throws Exception {

	}

	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		super.login("admin", "yicui338");
	}
	
}
