/**
 * Our main validation rule that is called when a connection has been dropped
 */
var ConnectionValidationSuccess = class ConnectionValidationSuccess extends ValidationRule {
	
	validate(validationData) {
		
		//Make the connection
		if(validationData.connectionFrom == (GameEditor.getEditorController().gameModel.GameId + "_start")) {
			var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionFrom}).get(0);
			var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionTo}).get(0);
			var connection = GameEditor.getEditorController().jsPlumbInstance.connect({ source: ep1 , target: ep2});
			connection.id = validationData.connectionId;
		} else {
			var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionFrom}).get(1);
			var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionTo}).get(0);
			var connection = GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
			connection.id = validationData.connectionId;
		}
		
		var state = this.getState(validationData.connectionTo);
		var state2 = this.getState(validationData.connectionFrom);
		
		var loopBack = this.isLoopBack(state2.htmlId, state.htmlId);
//		var neighborloopBack = false;
//		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({target : validationData.connectionTo});
//		for(var i = 0; i < neighborConnections.length; i++) {
//			if(neighborConnections[i].id != validationData.connectionId) {
//				var neighbors = GameEditor.getJsPlumbInstance().getConnections({source : neighborConnections[i].sourceId});
//				for(var n = 0; n < neighbors.length; n++) {
//					if(neighbors[n].targetId != validationData.connectionTo) {
//						if(this.isLoopBack(validationData.connectionTo, neighbors[n].targetId) && !this.getConnectionIsLoopBack(neighbors[n].id) && !this.getStateLoopBacks(neighbors[n].targetId)) {
//							neighborloopBack = true;
//							break;
//						}
//					}
//				}
//			}
//		}
		
		var neighborloopBack = this.isNeighborLoopBack(validationData);
		
		if(loopBack && !neighborloopBack) {
			validationData.isLoopBack = true;
		} else if(neighborloopBack) {
			validationData.isNeighborLoopBack = true;
		}
		
		//See if any connections have become neighbor loopbacks due to the new connection
		for(var i = 0; i < this.getState(validationData.connectionTo).inputConnections.length; i++) {
			if(this.isNeighborLoopBack(new Connection(this.getState(validationData.connectionTo).inputConnections[i].connectionId, this.getState(validationData.connectionTo).inputConnections[i].connectionFrom.htmlId, this.getState(validationData.connectionTo).inputConnections[i].connectionTo.htmlId))) {
				this.getState(validationData.connectionTo).inputConnections[i].isNeighborLoopBack = true;
			}
		}
		
		//Store the connection in the states
		state.inputConnections.push(validationData);
		state2.outputConnections.push(validationData);
		
		//Store the input and output state in the connection
		validationData.connectionTo = state;
		validationData.connectionFrom = state2;

		//Tell the state to update
		this.getState(validationData.connectionTo.htmlId).onChange();
		
		//Log it
		DataLogger.logGameEditor();
	}
	
	getConnectionIsLoopBack(connectionId) {
		for(var i = 0; i < GameEditor.getEditorController().connectionList.length; i++) {
			if(GameEditor.getEditorController().connectionList[i].connectionId == connectionId) {
				return GameEditor.getEditorController().connectionList[i].isLoopBack;
			}
		}
	}
	
	getStateLoopBacks(stateId) {
		for(var i = 0; i < this.getState(stateId).outputConnections.length; i++) {
			if(this.getState(stateId).outputConnections[i].isLoopBack) {
				return true;
			}
		}
		return false;
	}
	
	getState(stateId) {
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(GameEditor.getEditorController().stateList[i].htmlId == stateId) {
				return GameEditor.getEditorController().stateList[i];
			}
		}
	}

	isLoopBack(stateId, nextState, calledArgs = []) {
		var connections = GameEditor.getJsPlumbInstance().getConnections({source : nextState});
		for(var i = 0; i < connections.length; i++) {
			if(connections[i].targetId == stateId) {
				return true;
			} else {
				if(!calledArgs.includes(stateId + connections[i].targetId)) {
					calledArgs.push(stateId + connections[i].targetId);
					var result = this.isLoopBack(stateId, connections[i].targetId, calledArgs);
					if(result) {
						return result;
					}
				}
			}
		}
		return false;
	}
	
	isNeighborLoopBack(validationData) {
		var neighborloopBack = false;
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({target : validationData.connectionTo});
		for(var i = 0; i < neighborConnections.length; i++) {
			if(neighborConnections[i].id != validationData.connectionId) {
				var neighbors = GameEditor.getJsPlumbInstance().getConnections({source : neighborConnections[i].sourceId});
				for(var n = 0; n < neighbors.length; n++) {
					if(neighbors[n].targetId != validationData.connectionTo) {
						if(this.isLoopBack(validationData.connectionTo, neighbors[n].targetId) && !this.getConnectionIsLoopBack(neighbors[n].id) && !this.getStateLoopBacks(neighbors[n].targetId)) {
							neighborloopBack = true;
							break;
						}
					}
				}
			}
		}
		return neighborloopBack;
	}
}

/**
 * Our validation rule that is called when a connection is removed
 */
var ConnectionValidationDisconnect = class ConnectionValidationDisconnect extends ValidationRule {
	
	validate(validationData, connectionValidationSuccess) {
		//See if any connections are no longer a neighbor loopback due to a lost connection
		for(var i = 0; i < connectionValidationSuccess.getState(validationData.connectionTo.htmlId).inputConnections.length; i++) {
			if(!connectionValidationSuccess.isNeighborLoopBack(new Connection(connectionValidationSuccess.getState(validationData.connectionTo.htmlId).inputConnections[i].connectionId, connectionValidationSuccess.getState(validationData.connectionTo.htmlId).inputConnections[i].connectionFrom.htmlId, connectionValidationSuccess.getState(validationData.connectionTo.htmlId).inputConnections[i].connectionTo.htmlId)) && connectionValidationSuccess.getState(validationData.connectionTo.htmlId).inputConnections[i].isNeighborLoopBack) {
				connectionValidationSuccess.getState(validationData.connectionTo.htmlId).inputConnections[i].isNeighborLoopBack = false;
			}
		}
	}
}