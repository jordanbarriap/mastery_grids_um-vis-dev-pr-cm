var pawswebsocket =  {
	consts: {
		serverURL: 'ws://pawscomp2.sis.pitt.edu/mgnotificate',
		socketProtocol: 'echo-protocol',
		HANDSHAKE: 'handshake',
	},

	socket: null, //Opened socket to PAWS server
	openConnectionMessage: null,
	onMessageCallback: null,
	openWebSocket: function(connectionMessage, onMessageCallback) {
		var socket = new WebSocket(pawswebsocket.consts.serverURL, pawswebsocket.consts.socketProtocol);
		
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
	ensureSocketIsOpen: function() {
		if(pawswebsocket.socket.readyState === WebSocket.OPEN) return;
		
		//Open a new connection to the server
		pawswebsocket.openWebSocket(pawswebsocket.openConnectionMessage, pawswebsocket.onMessageCallback);
	}
}