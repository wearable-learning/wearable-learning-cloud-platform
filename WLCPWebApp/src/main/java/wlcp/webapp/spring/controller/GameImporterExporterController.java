package wlcp.webapp.spring.controller;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.util.Map.Entry;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import wlcp.model.master.Game;
import wlcp.model.master.Username;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.State;
import wlcp.model.master.state.StateType;
import wlcp.model.master.transition.KeyboardInput;
import wlcp.model.master.transition.SequenceButtonPress;
import wlcp.model.master.transition.Transition;

@Controller
@RequestMapping("/Controllers")
public class GameImporterExporterController {
	
	@Inject
	EntityManager entityManager;
	
	@GetMapping(value="/importGame", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@Transactional
	public void importGame() throws IOException {
		
		FileInputStream  fileIn = new FileInputStream("C:/Users/Matt/Downloads/exportGame");
		//FileInputStream  fileIn = new FileInputStream("C:/Users/Matt/git/wearable-learning-cloud-platform/WLCPGameServer/exports/" + gameId + ".wlcpgame");
		ObjectInputStream in = new ObjectInputStream(fileIn);
		Game game = null;
		try {
			game = (Game) in.readObject();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
			
		in.close();
		fileIn.close();
		
		Username username = entityManager.getReference(Username.class, game.getUsername().getUsernameId());
		game.setUsername(username);
		entityManager.merge(game);
		entityManager.flush();
		entityManager.clear();
		
	}

	@GetMapping(value="/exportGame", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody()
	public byte[] exportGame(@RequestParam("gameId") String gameId) throws IOException {
		
		Game game = entityManager.getReference(Game.class, gameId);
		game.hashCode();
		game.getStates().hashCode();
		game.getTransitions().hashCode();
		game.getConnections().hashCode();
		
		for(State state : game.getStates()) {
			if(state.getStateType().equals(StateType.OUTPUT_STATE)) {
				((OutputState) state).getDisplayText().hashCode();
			}
		}
		
		for(Transition transition : game.getTransitions()) {
			transition.getActiveTransitions().hashCode();
			transition.getSingleButtonPresses().hashCode();
			transition.getSequenceButtonPresses().hashCode();
			for(Entry<String, SequenceButtonPress> entry : transition.getSequenceButtonPresses().entrySet()) {
				entry.getValue().getSequences().hashCode();
			}
			transition.getKeyboardInputs().hashCode();
			for(Entry<String, KeyboardInput> entry : transition.getKeyboardInputs().entrySet()) {
				entry.getValue().getKeyboardInputs().hashCode();
			}
		}
		
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		ObjectOutput out = null;
		out = new ObjectOutputStream(bos);   
		out.writeObject(game);
		out.flush();
		byte[] yourBytes = bos.toByteArray();

		return yourBytes;
	}

}
