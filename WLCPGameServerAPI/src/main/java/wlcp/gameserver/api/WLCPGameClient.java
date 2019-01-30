package wlcp.gameserver.api;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.RestTemplateXhrTransport;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import wlcp.gameserver.api.exception.WLCPGameInstanceOrUsernameDoesNotExistException;
import wlcp.gameserver.api.exception.WLCPGameServerCouldNotConnectException;
import wlcp.shared.message.DisplayTextMessage;
import wlcp.shared.message.KeyboardInputMessage;
import wlcp.shared.message.PlayerAvaliableMessage;
import wlcp.shared.message.SequenceButtonPressMessage;
import wlcp.shared.message.SingleButtonPressMessage;

public class WLCPGameClient implements IWLCPGameClient {
	
	private String baseURL;
	private int port;
	private int gamePin;
	private String username;
	private int team;
	private int player;
	
	private SockJsClient sockJsClient;
	private WebSocketStompClient stompClient;
	private ListenableFuture<StompSession> stompSession;
	private WLCPGameClientSessionHandler sessionHandler;

	public WLCPGameClient(String baseURL, int port, int gamePin, String username) {
		this.baseURL = baseURL;
		this.port = port;
		this.gamePin = gamePin;
		this.username = username;
		List<Transport> transports = new ArrayList<Transport>(2);
		transports.add(new WebSocketTransport(new StandardWebSocketClient()));
		transports.add(new RestTemplateXhrTransport());
		sockJsClient = new SockJsClient(transports);
		stompClient = new WebSocketStompClient(sockJsClient);
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());
	}
	
	public List<PlayerAvaliableMessage> getPlayersAvailableFromGamePin() throws WLCPGameInstanceOrUsernameDoesNotExistException, IOException {
		URL url = new URL("http://" + baseURL + ":" + port + "/controllers/playersAvaliable/" + gamePin + "/" + username);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("Content-Type", "application/json");
		if(con.getResponseCode() == HttpURLConnection.HTTP_OK) {
			ObjectMapper mapper = new ObjectMapper();
			List<PlayerAvaliableMessage> players = mapper.readValue(con.getInputStream(), new TypeReference<List<PlayerAvaliableMessage>>(){});
			con.disconnect();
			return players;
		} else {
			con.disconnect();
			throw new WLCPGameInstanceOrUsernameDoesNotExistException("The Game Pin Or Username entered does not exist!");
		}
	}
	
	public void connect(int team, int player, WLCPGameClientSessionHandler sessionHandler) throws WLCPGameServerCouldNotConnectException {
		this.sessionHandler = sessionHandler;
		this.team = team;
		this.player = player;
		stompSession = stompClient.connect("ws://" + baseURL + ":" + port + "/wlcpGameServer/0", new StompSessionHandler(sessionHandler));
		try {
			stompSession.get();
		} catch (Exception e) {
			throw new WLCPGameServerCouldNotConnectException("Could not connect to game server! " + e.getMessage());
		}
	}
	
	public void connectToGameInstance() {
		try {
			stompSession.get().subscribe("/subscription/connectionResult/" + gamePin + "/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return Object.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.connectedToGameInstance();
				}
			
			});
		} catch (InterruptedException | ExecutionException e) {
			e.printStackTrace();
		}
		
		subscribeToChannels();
		
		try {
			stompSession.get().send("/app/gameInstance/" + gamePin + "/connectToGameInstance/" + username + "/" + team + "/" + player, "{}");
		} catch (InterruptedException | ExecutionException e) {
			e.printStackTrace();
		}
	}
	
	public void disconnectFromGameInstance() {
		try {
			stompSession.get().subscribe("/subscription/disconnectionResult/" + gamePin + "/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					return Object.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					try {
						sessionHandler.disconnectedFromGameInstance();
						stompSession.get().disconnect();
					} catch (InterruptedException e) {
						e.printStackTrace();
					} catch (ExecutionException e) {
						e.printStackTrace();
					}
				}
				
			});
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			e.printStackTrace();
		}
		try {
			stompSession.get().send("/app/gameInstance/" + gamePin + "/disconnectFromGameInstance/" + username + "/" + team + "/" + player, "{}");
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			e.printStackTrace();
		}
	}
	
	public void disconnectFromGameServer() {
		sockJsClient.stop();
		sessionHandler.disconnectedFromServer();
	}
	
	public void subscribeToChannels() {
		try {
			stompSession.get().subscribe("/subscription/gameInstance/" + gamePin + "/displayText/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return DisplayTextMessage.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					DisplayTextMessage msg = (DisplayTextMessage) payload;
					sessionHandler.displayTextRequest(msg);	
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			stompSession.get().subscribe("/subscription/gameInstance/" + gamePin + "/singleButtonPressRequest/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return Object.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.singleButtonPressRequest();
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			stompSession.get().subscribe("/subscription/gameInstance/" + gamePin + "/sequenceButtonPressRequest/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return Object.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.sequenceButtonPressRequest();
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			stompSession.get().subscribe("/subscription/gameInstance/" + gamePin + "/keyboardInputRequest/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return Object.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.keyboardInputRequest();
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendSingleButtonPress(int buttonPress) {
		SingleButtonPressMessage msg = new SingleButtonPressMessage();
		msg.buttonPress = buttonPress;
		try {
			stompSession.get().send("/app/gameInstance/" + gamePin + "/singleButtonPress/" + username + "/" + team + "/" + player, msg);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendSequenceButtonPress(String sequence) {
		SequenceButtonPressMessage msg = new SequenceButtonPressMessage();
		msg.sequenceButtonPress = sequence;
		try {
			stompSession.get().send("/app/gameInstance/" + gamePin + "/sequenceButtonPress/" + username + "/" + team + "/" + player, msg);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendKeyboardInput(String keyboardInput) {
		KeyboardInputMessage msg = new KeyboardInputMessage();
		msg.keyboardInput = keyboardInput;
		try {
			stompSession.get().send("/app/gameInstance/" + gamePin + "/keyboardInput/" + username + "/" + team + "/" + player, msg);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}

class StompSessionHandler extends StompSessionHandlerAdapter {
	
	private WLCPGameClientSessionHandler sessionHandler;
	
	public StompSessionHandler(WLCPGameClientSessionHandler sessionHandler) {
		this.sessionHandler = sessionHandler;
	}
	
	@Override
    public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
		sessionHandler.connectedToServer();
		((WLCPGameClient) sessionHandler.gameClient).connectToGameInstance();
	}
}

