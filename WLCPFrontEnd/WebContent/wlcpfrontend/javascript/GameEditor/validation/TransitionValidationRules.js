var TransitionValidationRule = class TransitionValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var parentMask = 0;
		
		var state = transition.wlcpConnection.connectionToState;
		
		//Loop through the parent states
		for(var i = 0; i < state.inputConnections.length; i++) {
			//Get the active scopes
			var activeScopes = ValidationEngineHelpers.getActiveScopesState(state.inputConnections[i].connectionFromState);
			
			//Get the active scope mask
			var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
			
			parentMask = parentMask | activeScopeMask;
		}
		
		parentMask = ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, parentMask);
		
		//Get the active scopes
		var activeScopes = ValidationEngineHelpers.getActiveScopesTransition(transition);
		
		//Get the active scope mask
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
		
		//Get the active scope masks
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
		
		//And the active scope mask together
		var andScopeMasks = ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
		
		transition.setScope(parentMask & andScopeMasks, GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		
		//Update the state below us
		transition.wlcpConnection.connectionToState.onChange();
	}
	
	setScopeData(transition, model) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == model.scope) {
				transition.modelJSON.iconTabs[i] = model;
				transition.model.setData(transition.modelJSON);
				break;
			}
		}
	}
	
	getTab(transition, scope) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == scope) {
				return transition.modelJSON.iconTabs[i];
			}
		}
		return null;
	}
}

var TransitionSequenceButtonPressValidationRule = class TransitionSequenceButtonPressValidationRule extends ValidationRule {
	
	validate(transition, sequence, scope) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
				if(scope == transitionList[i].modelJSON.iconTabs[n].scope) {
					if(this.containsSequence(sequence, transitionList[i].modelJSON.iconTabs[n].sequencePress)) {
						return false;
					}
				}
			}
		}
		
		return true;	
	}
	
	containsSequence(sequence, sequences) {
		for(var i = 0; i < sequences.length; i++) {
			if(sequences[i].buttons.length == sequence.buttons.length) {
				var equal = true;
				for(var n = 0; n < sequence.buttons.length; n++) {
					if(sequences[i].buttons[n].number != sequence.buttons[n].number) {
						equal = false;
						break;
					}
				}
				if(equal) {
					return true;
				}
			}
		}
		return false;
	}
}

var TransitionKeyboardInputValidationRule = class TransitionKeyboardInputValidationRule extends ValidationRule {
	
	validate(transition, keyboardInput, scope) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
				if(scope == transitionList[i].modelJSON.iconTabs[n].scope) {
					if(this.containsKeyboardInput(keyboardInput, transitionList[i].modelJSON.iconTabs[n].keyboardField)) {
						return false;
					}
				}
			}
		}
		
		return true;
	}
	
	containsKeyboardInput(keyboardInput, keyboardField) {
		for(var i = 0; i < keyboardField.length; i++) {
			if(keyboardField[i].value == keyboardInput) {
				return true;
			}
		}
		return false;
	}
}

var TransitionSelectedTypeValidationRule = class TransitionSelectedTypeValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.sourceId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.id) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			var scopes = transitionList[i].modelJSON.iconTabs;
			for(var n = 0; n < scopes.length; n++) {
				var activeList = [];
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							activeList.push(this.getActiveTransitionType(transitionList[j], scopes[n].scope));
						}
					}
				}
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						var transitionTypes = transitionList[j].modelJSON.iconTabs[k].transitionTypes;
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							for(var l = 0; l < transitionTypes.length; l++) {
								if(activeList.includes("") && !activeList.includes("Single Button Press") && !activeList.includes("Sequence Button Press") && !activeList.includes("Keyboard Input")) {
									transitionTypes[l].visible = true;
								} else if(activeList.includes(transitionTypes[l].title)) {
									transitionTypes[l].visible = true;
									transitionList[j].modelJSON.iconTabs[k].activeTransition = transitionTypes[l].title;
								} else {
									transitionTypes[l].visible = false;
								}
							}
							transitionList[j].model.setData(transitionList[j].modelJSON);
						}
					}
				}
			}
		}
	}
	
	getActiveTransitionType(transition, scope) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == scope) {
				if(transition.modelJSON.iconTabs[i].singlePress[0].selected || transition.modelJSON.iconTabs[i].singlePress[1].selected || 
				    transition.modelJSON.iconTabs[i].singlePress[2].selected || transition.modelJSON.iconTabs[i].singlePress[3].selected) {
					return "Single Button Press";
				} else if(transition.modelJSON.iconTabs[i].sequencePress.length > 0) {
					return "Sequence Button Press";
				} else if(transition.modelJSON.iconTabs[i].keyboardField.length > 0) {
					return "Keyboard Input";
				}
			}
		}
		return "";
	}
}