var pawswebsocket =  {
	consts: {
		serverURL: 'ws://pawscomp2.sis.pitt.edu/mgnotificate',
		socketProtocol: 'echo-protocol',
		HANDSHAKE: 'handshake',
		SOCKET_TIME_LIMIT: 10000
	},

	socket: null, //Opened socket to PAWS server
	openConnectionMessage: null,
	onMessageCallback: null,
	lastWebSocketOpenTime: null,
	opentSocketTimeLimitMS: null,
	connectionRefused: false,
	openWebSocket: function(connectionMessage, onMessageCallback) {
		// Only allow to re-open a websocket after openSocketTimeLimitMS time elapsed. 
		if(pawswebsocket.lastWebSocketOpenTime != null) {
			var timeDiff =  new Date() - pawswebsocket.lastWebSocketOpenTime
			if(pawswebsocket.openSocketTimeLimitMS == undefined || timeDiff <= pawswebsocket.openSocketTimeLimitMS) {
				if(pawswebsocket.connectionRefused) {
					pawswebsocket.openSocketTimeLimitMS *= 2
				}

				pawswebsocket.connectionRefused = true
				return;
			}
		}

		var socket = new WebSocket(pawswebsocket.consts.serverURL + "?usr=" + connectionMessage.usr, pawswebsocket.consts.socketProtocol);
		
		socket.onerror = function(error) {
			console.log('Connection Error: ' + error);
		};

		// Show a connected message when the WebSocket is opened.
		socket.onopen = function(event) {
			console.log('Connection established: ' + connectionMessage);
			pawswebsocket.sendMessage(connectionMessage, pawswebsocket.consts.HANDSHAKE);
		};

		// Handle messages sent by the server.
		socket.onmessage = function(event) {
			var data = JSON.parse(event.data)
			console.log('message received: ' + data);
			onMessageCallback(data);
		};

		// Show a disconnected message when the WebSocket is closed.
		socket.onclose = function(event) {
			console.log('Connection closed: ' + event.data);
		};
		
		pawswebsocket.socket = socket;
		pawswebsocket.openConnectionMessage = connectionMessage;
		pawswebsocket.onMessageCallback = onMessageCallback;
		pawswebsocket.lastWebSocketOpenTime = new Date()
		pawswebsocket.connectionRefused = false
		pawswebsocket.openSocketTimeLimitMS = pawswebsocket.consts.SOCKET_TIME_LIMIT
	},
	sendMessage: function(message, messagetype) {
		if(pawswebsocket.socket.readyState === pawswebsocket.socket.OPEN) {
			var msg = {
				type: messagetype,
				text: message
		   };
		   
			pawswebsocket.socket.send(JSON.stringify(msg));
		} else {
			pawswebsocket.openWebSocket(message, pawswebsocket.socket.onmessage);
		}
	},
	ensureSocketIsOpen: function(connectionMessage, onMessageCallback) {
		if(pawswebsocket.socket) {
			if(pawswebsocket.socket.readyState === WebSocket.OPEN) {
				return
			} else {
				//Open a new connection to the server
				pawswebsocket.openWebSocket(pawswebsocket.openConnectionMessage, pawswebsocket.onMessageCallback);
			}
		} else {
			// Open the initial connection to the server
			pawswebsocket.openWebSocket(connectionMessage, onMessageCallback);
		}
		
		
	}
}