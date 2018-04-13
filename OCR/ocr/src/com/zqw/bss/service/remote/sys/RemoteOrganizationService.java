//==============================================================================
// Created on 2009-7-7
// $Id$
//==============================================================================
package com.zqw.bss.service.remote.sys;

import javax.ws.rs.Path;

/**
 * <p>
 * Remote Place Service
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007-2010 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Path("/organization")
public interface RemoteOrganizationService {


//	/**
//	 * Get Place By Id
//	 * 
//	 * @param Long
//	 *            Id
//	 * @return Place
//	 */
//	@GET
//	@Path("/")
//	@Produces(MediaTypes.JSON_UTF_8)
//	public List<Organization> getAllOrganization();

//	/**
//	 * Get Place By Id
//	 * 
//	 * @param Long
//	 *            Id
//	 * @return Place
//	 */
//	@GET
//	@Path("/organizationid/{id}")
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Organization getOrganizationById(@PathParam("id") Long id);

//	/**
//	 * login by organizationname
//	 * 
//	 * @param Long
//	 *            Id
//	 * @return Place
//	 */
//	@POST
//	@Path("/")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Organization createOrganization(Organization organization);

//	/**
//	 * Get Place By Id
//	 * 
//	 * @param Long
//	 *            Id
//	 * @return Place
//	 */
//	@PUT
//	@Path("/")
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Boolean updateOrganization(Organization organization);

//	/**
//	 * Get Place By Id
//	 * 
//	 * @param Long
//	 *            Id
//	 * @return Place
//	 */
//	@DELETE
//	@Path("/{id}")
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Boolean delOrganizationById(@PathParam("id") Long id);

//	/**
//	 * 
//	 * @param query
//	 * @return
//	 */
//	@GET
//	@Path("/search/{query}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public BaseModelList<Organization> searchOrganizations(@PathParam("query") String query);
	
}
