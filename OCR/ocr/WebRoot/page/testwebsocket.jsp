<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<header>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="cache-control" content="no-cache" />
</header>
<body>
<textarea rows="" cols="" id=msgHolder></textarea>
</body>
</html>
<script>
	var reconnectTimer = null;
	var ws = null;
	
	function processNewOcrRequestMsg(msg){
		document.getElementById('msgHolder').value = document
				.getElementById('msgHolder').value
				+ '\n' + JSON.stringify(msg);
	}
	
	function connectWebsocket() {
		if (ws!=null){
			if (ws.readyState<=1){//0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED
				return;
			} else {
				ws = null;
			}
		}
		
		<%
			String cp = request.getServletContext().getContextPath();
			if ("/".equals(cp)) cp="";
		%>
		var target = "ws://"+window.location.host+"<%=cp%>/websocket/ocrreq";
		if ('WebSocket' in window) {
			ws = new WebSocket(target);
		} else if ('MozWebSocket' in window) {
			ws = new MozWebSocket(target);
		} else {
			alert('请改用支持WebSocket的浏览器');
			return;
		}

		ws.onopen = function(obj) {
			console.info('open');
			console.info(obj);
			if (reconnectTimer) {
				clearInterval(reconnectTimer);
				reconnectTimer = null;
			}
		};

		ws.onclose = function(obj) {
			console.info('close');
			console.info(obj);
			if (reconnectTimer == null) {
				reconnectTimer = setInterval("connectWebsocket()", 3000);
			}
		};

		ws.onerror = function(err) {
			console.info('error');
			console.info(err);
			if (reconnectTimer == null) {
				reconnectTimer = setInterval("connectWebsocket()", 3000);
			}
		}

		ws.onmessage = function(obj) {
			console.info('message');
			console.info(obj);
			if (reconnectTimer) {
				clearInterval(reconnectTimer);
				reconnectTimer = null;
			}
			var msg = JSON.parse(obj.data);
			if ("error" == msg.type) {
				alert(msg.data.errorMsg);
				if (msg.data.errorCode == 401) {
					window.location.href = "<%=cp%>/page/login/login.jsp";
					return;
				} else {
					alert(msg.data.errorMsg);
				}
			} else if ("newOcrReq" == msg.type) {
				processNewOcrRequestMsg(msg);
			}
		};
	};
	connectWebsocket();
</script>  