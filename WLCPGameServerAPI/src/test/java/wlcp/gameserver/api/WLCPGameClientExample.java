package wlcp.gameserver.api;

import java.io.IOException;
import java.util.List;
import java.util.Scanner;

import wlcp.gameserver.api.exception.WLCPGameInstanceOrUsernameDoesNotExistException;
import wlcp.gameserver.api.exception.WLCPGameServerCouldNotConnectException;
import wlcp.shared.message.PlayerAvaliableMessage;

public class WLCPGameClientExample {
	
private static Scanner scanner = new Scanner(System.in);
	
	public static void main(String[] args) throws WLCPGameInstanceOrUsernameDoesNotExistException, IOException, WLCPGameServerCouldNotConnectException {
		System.out.print("Please enter a username: ");
		String username = scanner.next();
		System.out.println();
		System.out.print("Please enter a game pin: ");
		int gamePin = scanner.nextInt();
		System.out.println();
		IWLCPGameClient gameClient = new WLCPGameClient("localhost", 3333, gamePin, username);
		List<PlayerAvaliableMessage> players = gameClient.getPlayersAvailableFromGamePin();
		System.out.println("The following teams are available for joining: ");
		for(PlayerAvaliableMessage message : players) {
			System.out.println(players.indexOf(message) + ". " + "Team " + message.team + " Player " + message.player);
		}
		System.out.print("Please select an index: ");
		int index = scanner.nextInt();
		System.out.println();
		gameClient.connect(players.get(index).team, players.get(index).player, new WLCPGameServerSessionHandlerImplExample(gameClient));
		
		while(true) {
			
		}
	}

}
