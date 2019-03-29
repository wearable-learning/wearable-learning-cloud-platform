package wlcp.webapp.spring.controller;

import java.util.ArrayList;
import java.util.HashMap;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import wlcp.model.master.Game;
import wlcp.model.master.Username;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.State;
import wlcp.model.master.state.StateType;
import wlcp.model.master.transition.Transition;

@Controller
@RequestMapping("/Controllers")
public class CopyRenameDeleteGameController {
	
	@Inject
	EntityManager entityManager;
	
	@GetMapping(value="/copyGame")
	@Transactional
	public ResponseEntity<?> copyGame(@RequestParam("gameId") String gameId, @RequestParam("newGameId") String newGameId, @RequestParam("usernameId") String usernameId) {
		
		if(entityManager.find(Game.class, newGameId) != null) {
			return new ResponseEntity<String>("New name already exists!", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		recreateGame(gameId, newGameId, usernameId);
		
		return new ResponseEntity<String>("", HttpStatus.OK);
	}
	
	@GetMapping(value="/renameGame")
	@Transactional
	public ResponseEntity<?> renameGame(@RequestParam("gameId") String gameId, @RequestParam("newGameId") String newGameId, @RequestParam("usernameId") String usernameId) {
		Game game = entityManager.getReference(Game.class, gameId);
		
		if(game.getUsername().getUsernameId().equals(usernameId)) {
			recreateGame(gameId, newGameId, usernameId);
			deleteGame(gameId, usernameId);
			return new ResponseEntity<String>("Success!", HttpStatus.OK);
		} else {
			return new ResponseEntity<String>("You must own the game to rename it!", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	@GetMapping(value="/deleteGame")
	@Transactional
	public ResponseEntity<?> deleteGame(@RequestParam("gameId") String gameId, @RequestParam("usernameId") String usernameId) {
		Game game = entityManager.getReference(Game.class, gameId);
		
		if(game.getUsername().getUsernameId().equals(usernameId)) {
			entityManager.remove(game);
			return new ResponseEntity<String>("Success!", HttpStatus.OK);
		} else {
			return new ResponseEntity<String>("You must own the game to delete it!", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	private void recreateGame(String gameId, String newGameId, String usernameId) {
		
		Game game = entityManager.getReference(Game.class, gameId);
		Username username = entityManager.getReference(Username.class, usernameId);
		
		Game newGame = new Game(game.getGameId().replace(gameId, newGameId), game.getTeamCount(), game.getPlayersPerTeam(), username, game.getVisibility(), game.getDataLog());
		newGame.setStateIdCount(game.getStateIdCount());
		newGame.setConnectionIdCount(game.getConnectionIdCount());
		newGame.setTransitionIdCount(game.getTransitionIdCount());
		
		entityManager.persist(newGame);
		
		for(State state : game.getStates()) {
			if(state.getStateType().equals(StateType.START_STATE)) {
				StartState newStartState = new StartState(state.getStateId().replace(gameId, newGameId), newGame, state.getStateType(), state.getPositionX(), state.getPositionY(), new ArrayList<Connection>(), new ArrayList<Connection>());
				newGame.getStates().add(newStartState);
				entityManager.persist(newStartState);
			} else {
				OutputState newOutputState = new OutputState(state.getStateId().replace(gameId, newGameId), newGame, state.getStateType(), state.getPositionX(), state.getPositionY(), new ArrayList<Connection>(), new ArrayList<Connection>(), ((OutputState) state).getDescription(), ((OutputState) state).getDisplayText(),  ((OutputState) state).getPictureOutputs());
				newGame.getStates().add(newOutputState);
				entityManager.persist(newOutputState);
			}
		}
		
		for(Connection connection : game.getConnections()) {
			Connection newConnection = new Connection(connection.getConnectionId().replace(gameId, newGameId), newGame, null, null, connection.getBackwardsLoop(), null);
			newGame.getConnections().add(newConnection);
			entityManager.persist(newConnection);
		}
		
		for(Transition transition : game.getTransitions()) {
			Transition newTransition = new Transition(transition.getTransitionId().replace(gameId, newGameId), newGame, null, new HashMap<String, String>(), transition.getSingleButtonPresses(), transition.getSequenceButtonPresses(), transition.getKeyboardInputs());
			newGame.getTransitions().add(newTransition);
			entityManager.persist(transition);
		}
		
		entityManager.merge(newGame);
		
		for(State state : game.getStates()) {
			for(Connection inputConnection : state.getInputConnections()) {
				State newState = entityManager.getReference(State.class, state.getStateId().replace(gameId, newGameId));
				newState.getInputConnections().add(entityManager.getReference(Connection.class, inputConnection.getConnectionId().replace(gameId, newGameId)));
				entityManager.merge(newState);
			}
			for(Connection outputConnection : state.getOutputConnections()) {
				State newState = entityManager.getReference(State.class, state.getStateId().replace(gameId, newGameId));
				newState.getOutputConnections().add(entityManager.getReference(Connection.class, outputConnection.getConnectionId().replace(gameId, newGameId)));
				entityManager.merge(newState);
			}
		}
		
		for(Connection connection : game.getConnections()) {
			Connection newConnection = entityManager.getReference(Connection.class, connection.getConnectionId().replace(gameId, newGameId));
			newConnection.setConnectionFrom(entityManager.find(State.class, connection.getConnectionFrom().getStateId().replace(gameId, newGameId)));
			newConnection.setConnectionTo(entityManager.find(State.class, connection.getConnectionTo().getStateId().replace(gameId, newGameId)));
			if(connection.getTransition() != null) {
				newConnection.setTransition(entityManager.getReference(Transition.class, connection.getTransition().getTransitionId().replace(gameId, newGameId)));
			}
			entityManager.merge(newConnection);
		}
		
		for(Transition transition : game.getTransitions()) {
			Transition newTransition = entityManager.getReference(Transition.class, transition.getTransitionId().replace(gameId, newGameId));
			newTransition.setConnection(entityManager.getReference(Connection.class, transition.getConnection().getConnectionId().replace(gameId, newGameId)));
			entityManager.persist(newTransition);
		}
	}
		

}
