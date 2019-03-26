package wlcp.webapp.spring.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.util.Map.Entry;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import wlcp.model.master.Game;
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
	
	@PostMapping(value="/importGame")
	@Transactional
	public ResponseEntity<String> importGame(@RequestParam("file") MultipartFile file) throws IOException {
	
		ObjectInputStream in = new ObjectInputStream(file.getInputStream());
		Game game = null;
		try {
			game = (Game) in.readObject();
		} catch (ClassNotFoundException e) {
			in.close();
			e.printStackTrace();
			return new ResponseEntity<String>("Error importing!", HttpStatus.INTERNAL_SERVER_ERROR);
		}
			
		in.close();

		entityManager.merge(game);
		entityManager.flush();
		entityManager.clear();
		
		return new ResponseEntity<String>("Import Success!", HttpStatus.OK);
	}

	@GetMapping(value="/exportGame", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@Transactional
	public ResponseEntity<byte[]> exportGame(@RequestParam("gameId") String gameId) {
		
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
		
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		ObjectOutput outputObject = null;
		try {
			outputObject = new ObjectOutputStream(byteArrayOutputStream);
			outputObject.writeObject(game);
			outputObject.flush();
		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}  
		
		HttpHeaders responseHeaders = new HttpHeaders();
	    responseHeaders.add("content-disposition", "attachment; filename=" + game.getGameId() + ".wlcpx");

		return new ResponseEntity<byte[]>(byteArrayOutputStream.toByteArray(), responseHeaders, HttpStatus.OK);
	}

}
