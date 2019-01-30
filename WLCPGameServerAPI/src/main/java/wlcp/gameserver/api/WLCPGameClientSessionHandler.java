package wlcp.gameserver.api;

import wlcp.shared.message.DisplayTextMessage;

public abstract class WLCPGameClientSessionHandler  {
	
	protected IWLCPGameClient gameClient;
	
	public WLCPGameClientSessionHandler(IWLCPGameClient gameClient) {
		this.gameClient = gameClient;
	}
	
	public abstract void connectedToServer();
	public abstract void connectedToGameInstance();
	
	public abstract void disconnectedFromServer();
	public abstract void disconnectedFromGameInstance();
	
	public abstract void displayTextRequest(DisplayTextMessage msg);
	public abstract void singleButtonPressRequest();
	public abstract void sequenceButtonPressRequest();
	public abstract void keyboardInputRequest();
	
}
