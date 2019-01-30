package wlcp.gameserver.api;

import java.util.Scanner;

import wlcp.shared.message.DisplayTextMessage;

public class WLCPGameServerSessionHandlerImplExample extends WLCPGameClientSessionHandler {
	
	private Scanner scanner = new Scanner(System.in);

	public WLCPGameServerSessionHandlerImplExample(IWLCPGameClient gameClient) {
		super(gameClient);
	}
	
	@Override
	public void connectedToServer() {
		System.out.println("Connected To Game Server!");
	}

	@Override
	public void connectedToGameInstance() {
		System.out.println("Connected To Game Instance!");	
	}
	
	@Override
	public void disconnectedFromServer() {
		System.out.println("Disconnected From Game Server!");
	}

	@Override
	public void disconnectedFromGameInstance() {
		System.out.println("Disconnected From Game Instance!");	
	}

	@Override
	public void displayTextRequest(DisplayTextMessage msg) {
		System.out.println(msg.displayText);
	}

	@Override
	public void singleButtonPressRequest() {
		System.out.print("Please Enter a button 1-4: ");
		gameClient.sendSingleButtonPress(scanner.nextInt());
	}

	@Override
	public void sequenceButtonPressRequest() {
		System.out.print("Please Enter a sequence using the numbers 1-4: ");
		gameClient.sendSequenceButtonPress(scanner.next());
	}

	@Override
	public void keyboardInputRequest() {
		System.out.print("Please Enter some keyboard input: ");
		gameClient.sendKeyboardInput(scanner.next());
	}

}
