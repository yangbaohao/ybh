package com.zqw.bss.util.security.shiro;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.web.filter.authc.AnonymousFilter;
import org.apache.shiro.web.filter.authc.LogoutFilter;
import org.apache.shiro.web.filter.mgt.FilterChainManager;
import org.apache.shiro.web.filter.mgt.PathMatchingFilterChainResolver;
import org.apache.shiro.web.filter.session.NoSessionCreationFilter;

import com.zqw.bss.framework.thread.ThreadLocalVar;

/**
 * <p>
 * Custom Path Matching Filter Chain Resolver
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */

public class CustomPathMatchingFilterChainResolver extends
		PathMatchingFilterChainResolver {

	private CustomDefaultFilterChainManager customDefaultFilterChainManager;

	public void setCustomDefaultFilterChainManager(
			CustomDefaultFilterChainManager customDefaultFilterChainManager) {
		this.customDefaultFilterChainManager = customDefaultFilterChainManager;
		setFilterChainManager(customDefaultFilterChainManager);
	}

	public FilterChain getChain(ServletRequest request,
			ServletResponse response, FilterChain originalChain) {
		FilterChainManager filterChainManager = getFilterChainManager();
		if (!filterChainManager.hasChains()) {
			return null;
		}

		String requestURI = getPathWithinApplication(request);

		ThreadLocalVar.requestURL.set(requestURI);

		List<String> chainNames = new ArrayList<String>();
		// the 'chain names' in this implementation are actually path patterns
		// defined by the user. We just use them
		// as the chain name for the FilterChainManager's requirements
		for (String pathPattern : filterChainManager.getChainNames()) {

			// If the path does match, then pass on to the subclass
			// implementation for specific checks:
			if (pathMatches(pathPattern, requestURI)) {

				for (Filter filter : filterChainManager.getChain(pathPattern)) {
					// 如存在 URL配置为anon的拦截链,则无需执行任何拦截器，返回空
					if (filter instanceof AnonymousFilter)
						return null;

					// 如存在 URL配置为noSessionCreation的拦截链,则仅需执行authcBasic
					if (filter instanceof NoSessionCreationFilter) {
						chainNames.clear();
						chainNames.add(pathPattern);
						// chainNames.add("authcBasic");
						return customDefaultFilterChainManager.proxy(
								originalChain, chainNames);

					}

					// 如存在 URL配置为Logout的拦截链,则无需执行其他拦截器，仅需执行LogoutFilter
					if (filter instanceof LogoutFilter) {
						chainNames.clear();
						chainNames.add(pathPattern);
						return customDefaultFilterChainManager.proxy(
								originalChain, chainNames);
					}

				}

				chainNames.add(pathPattern);
			}

		}

		if (chainNames.size() == 0) {
			return null;
		}

		return customDefaultFilterChainManager.proxy(originalChain, chainNames);
	}
}
