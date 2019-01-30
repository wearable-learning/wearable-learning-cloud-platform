package wlcp.gameserver.api;

import java.io.IOException;
import java.util.List;

import wlcp.gameserver.api.exception.WLCPGameInstanceOrUsernameDoesNotExistException;
import wlcp.gameserver.api.exception.WLCPGameServerCouldNotConnectException;
import wlcp.shared.message.PlayerAvaliableMessage;

public interface IWLCPGameClient {

	List<PlayerAvaliableMessage> getPlayersAvailableFromGamePin() throws WLCPGameInstanceOrUsernameDoesNotExistException, IOException;
	void connect(int team, int player, WLCPGameClientSessionHandler sessionHandler) throws WLCPGameServerCouldNotConnectException;
	void disconnectFromGameInstance();
	void disconnectFromGameServer();
	void sendSingleButtonPress(int buttonPress);
	void sendSequenceButtonPress(String sequence);
	void sendKeyboardInput(String keyboardInput);
	
}
