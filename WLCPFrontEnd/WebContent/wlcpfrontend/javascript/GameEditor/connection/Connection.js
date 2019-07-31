/**
 * 
 */

var Connection = class Connection {
	constructor(connectionId, connectionFrom, connectionTo) {
		this.connectionId = connectionId;
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
		this.transition = null;
		this.isLoopBack = false;
		this.isNeighborLoopBack = false;
		this.validationCounter = -1;
		this.validationRules = [];
		this.setupValidationRules();
	}
	
	static load(loadData) {
		for(var i = 0; i < loadData.length; i++) {
			var editorConnection = new Connection(loadData[i].connectionId, loadData[i].connectionFrom.stateId, loadData[i].connectionTo.stateId);
			editorConnection.isLoopBack = loadData[i].backwardsLoop;
			GameEditor.getEditorController().connectionList.push(editorConnection);
			if(loadData[i].connectionFrom.htmlId == (GameEditor.getEditorController().gameModel.GameId + "_start") || loadData[i].connectionFrom.stateId.includes("_start")) {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionFrom.stateId}).get(0);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionTo.stateId}).get(0);
				var connection = GameEditor.getEditorController().jsPlumbInstance.connect({ source: ep1 , target: ep2});
				connection.id = loadData[i].connectionId;
			} else {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionFrom.stateId}).get(1);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionTo.stateId}).get(0);
				var connection = GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
				connection.id = loadData[i].connectionId;
			}
		}
	}
	
	validate() {
		if(this.validationCounter != this.validationRules.length - 1) {
			this.validationCounter++;
			this.validationRules[this.validationCounter].validate(this);
		} else {
			this.validationCounter = -1;
		}
	}
	
	validateConnectionAttached() {
		this.validationRules[0].validate(this);
	}
	
	validateConnectionDetached() {
		this.validationRules[1].validate(this, new ConnectionValidationSuccess());
	}
	
	setupValidationRules() {
		this.validationRules.push(new ConnectionValidationSuccess());
		this.validationRules.push(new ConnectionValidationDisconnect());
	}

	detach() {
		
		//Loop through all of the transitions
		for(var i = 0; i < GameEditor.getEditorController().transitionList.length; i++) {
			
			//If we found the transition on this connection remove it
			if(GameEditor.getEditorController().transitionList[i].connection.connectionId == this.connectionId) {
				
				//Remove it
				GameEditor.getEditorController().transitionList[i].removeTransition(sap.m.MessageBox.Action.OK);
				break;
			}
		}
		
		//Remove ourselves from states
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().stateList[i].inputConnections.length; n++) {
				if(GameEditor.getEditorController().stateList[i].inputConnections[n].connectionId == this.connectionId) {
					GameEditor.getEditorController().stateList[i].inputConnections.splice(n, 1);
					n--;
				}
			}
			for(var n = 0; n < GameEditor.getEditorController().stateList[i].outputConnections.length; n++) {
				if(GameEditor.getEditorController().stateList[i].outputConnections[n].connectionId == this.connectionId) {
					GameEditor.getEditorController().stateList[i].outputConnections.splice(n, 1);
					n--;
				}
			}
		}
		
		if(GameEditor.getEditorController().connectionList.indexOf(this) >= 0) {
			//Remove ourself from the connection list
			GameEditor.getEditorController().connectionList.splice(GameEditor.getEditorController().connectionList.indexOf(this), 1);
		}
		
		//Revalidates the states that were below this connection
		this.connectionTo.revalidate();
	}
	
	save() {
		var saveData = {
			connectionId : this.connectionId,
			connectionFrom : {
				stateId : this.connectionFrom.htmlId
			},
			connectionTo : {
				stateId : this.connectionTo.htmlId
			},
			backwardsLoop : this.isLoopBack,
			transition : this.transition == null ? null : {
				transitionId : this.transition.overlayId
			}
		}
		return saveData;
	}
}