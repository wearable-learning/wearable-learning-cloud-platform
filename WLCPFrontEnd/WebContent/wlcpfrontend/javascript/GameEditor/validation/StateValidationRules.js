var StateScopeValidationRule = class StateScopeValidationRule extends ValidationRule {

	validate(state, updateNeighbors = true, revalidate = false) {
	
		var parentMask = 0;
		
		//Loop through the parent states
		for(var i = 0; i < state.inputConnections.length; i++) {
			if(state.inputConnections[i].transition == null) {
				//Get the active scopes
				var activeScopes = ValidationEngineHelpers.getActiveScopesState(state.inputConnections[i].connectionFrom);
				
				//Get the active scope mask
				var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
				
				parentMask = parentMask | activeScopeMask;
			} else {
				//Get the active scopes
				var activeScopes = ValidationEngineHelpers.getActiveScopesTransition(state.inputConnections[i].transition);
				
				//Get the active scope mask
				var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
				
				parentMask = parentMask | activeScopeMask;
			}
		}
		
		parentMask = ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, parentMask);
		
		var transitionCount = 0;
		
		for(var i = 0; i < state.inputConnections.length; i++) {
			if(state.inputConnections[i].transition != null) {
				transitionCount++;
			}
		}
		
		var neighborMask = 0;
		var neighborLoopBackMask = 0;
		
		//Loop through the neighbor states
		for(var i = 0; i < state.inputConnections.length; i++) {
			for(var n = 0; n < state.inputConnections[i].connectionFrom.outputConnections.length; n++) {
				if(state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.htmlId != state.htmlId && state.inputConnections[i].connectionFrom.outputConnections[n].transition == null) {
					
					//If its a loopback and transition, the only neighbors we care about are the ones in the transition
					if(state.inputConnections[i].connectionFrom.outputConnections[n].isLoopBack && state.inputConnections[i].connectionFrom.outputConnections[n].transition != null) {
						//Get the active scopes
						var activeScopes = ValidationEngineHelpers.getActiveScopesTransition(state.inputConnections[i].connectionFrom.outputConnections[n].transition);
					} else {
						//Get the active scopes
						var activeScopes = ValidationEngineHelpers.getActiveScopesState(state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo);
					}
					
					//Get the active scope mask
					var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
					
					var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
					
					var notActiveScopeMasks = ~ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
					
					neighborMask = neighborMask | (activeScopeMask | notActiveScopeMasks);
				} 
//				else if(state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.htmlId == state.htmlId && state.inputConnections[i].connectionFrom.outputConnections[n].isNeighborLoopBack) {
//					//Get the active scopes
//					var activeScopes = ValidationEngineHelpers.getActiveScopesState(state.inputConnections[i].connectionFrom.outputConnections[n].connectionFrom);
//					
//					//Get the active scope mask
//					var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
//					
//					neighborLoopBackMask = ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
//				}
			}
		}
		
//		for(var i = 0; i < state.inputConnections.length; i++) {
//			for(var n = 0; n < state.inputConnections[i].connectionFrom.outputConnections.length; n++) {
//				for(var j = 0; j < state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.inputConnections.length; j++) {
//					if(state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.inputConnections[j].isNeighborLoopBack && state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.htmlId == state.htmlId ) {
//						//Get the active scopes
//						var activeScopes = ValidationEngineHelpers.getActiveScopesState(state.inputConnections[i].connectionFrom.outputConnections[n].connectionFrom);
//						
//						//Get the active scope mask
//						var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
//						
//						neighborLoopBackMask = ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
//					}
//				}
//			}
//		}
		
		//Loop through the output connections of our parents
		for(var i = 0; i < state.inputConnections.length; i++) {
			for(var n = 0; n < state.inputConnections[i].connectionFrom.outputConnections.length; n++) {
				if(state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.htmlId == state.htmlId && state.inputConnections[i].connectionFrom.outputConnections[n].isNeighborLoopBack) {
					//Get the active scopes
					var activeScopes = ValidationEngineHelpers.getActiveScopesState(state.inputConnections[i].connectionFrom.outputConnections[n].connectionFrom);
					
					//Get the active scope mask
					var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
					
					if(state.inputConnections[i].connectionFrom.outputConnections[n].connectionFrom.scopeMask != 1) {
						neighborLoopBackMask |= ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
					} else {
						neighborLoopBackMask |= activeScopeMask;
					}
				}
			}
		}
		
		//Loop through our output connections
		for(var i = 0; i < state.outputConnections.length; i++) {
			for(var n = 0; n < state.outputConnections[i].connectionTo.inputConnections.length; n++) {
				if(state.outputConnections[i].connectionTo.inputConnections[n].isNeighborLoopBack) {
					//Get the active scopes
					var activeScopes = ValidationEngineHelpers.getActiveScopesState(state);
					
					//Get the active scope mask
					var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
					
					neighborLoopBackMask |= ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
				}
			}
		}
		
		var transitionNeighborMask = 0;
		//Loop through the neighbor transitions
		
		//Loop through my input connections output connections
		//Some but not all
		
		if(transitionCount != state.inputConnections.length) {
			for(var i = 0; i < state.inputConnections.length; i++) {
				transitionCount = 0;
				for(var n = 0; n < state.inputConnections[i].connectionFrom.outputConnections.length; n++) {
					if(state.inputConnections[i].connectionFrom.outputConnections[n].transition != null) {
						transitionCount++;
					}
				}
				if(transitionCount != state.inputConnections[i].connectionFrom.outputConnections.length) {
					for(var n = 0; n < state.inputConnections[i].connectionFrom.outputConnections.length; n++) {
						if(state.inputConnections[i].connectionFrom.outputConnections[n].transition != null && state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.htmlId != state.htmlId) {
							var activeScopes = ValidationEngineHelpers.getActiveScopesTransition(state.inputConnections[i].connectionFrom.outputConnections[n].transition);
							
							//Get the active scope mask
							var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
							
							var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
							
							var notActiveScopeMasks = ~ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
							
							transitionNeighborMask = transitionNeighborMask | (activeScopeMask | notActiveScopeMasks);
						}
					}
				}
			}
		}
		
		//Get the active scopes
		var activeScopes = ValidationEngineHelpers.getActiveScopesState(state);
		
		//Get the active scope mask
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
		
		//Get the active scope masks
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
		
		//And the active scope mask together
		var andScopeMasks = ValidationEngineHelpers.checkForReverseScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, parentMask, ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks));
		
		//Set the states scope
		state.setScope(parentMask & andScopeMasks & (~neighborMask | neighborLoopBackMask) & (~transitionNeighborMask), GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		
		if(revalidate) {
			//Recursively revalidate the states below us
			if(updateNeighbors) {
				for(var i = 0; i < state.outputConnections.length; i++) {
					//Ignore loop backs
					if(!state.outputConnections[i].isLoopBack && !state.outputConnections[i].isNeighborLoopBack) {
						this.validate(state.outputConnections[i].connectionTo, true, revalidate)
					}
				}
			}
			
			//Revalidate our neighbors but make sure they dont revalidate their neighbors
			if(updateNeighbors) {
				for(var i = 0; i < state.inputConnections.length; i++) {
					for(var n = 0; n < state.inputConnections[i].connectionFrom.outputConnections.length; n++) {
						if(state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo.htmlId != state.htmlId) {
							if(!state.inputConnections[i].connectionFrom.outputConnections[n].isLoopBack) {
								if(state.inputConnections[i].connectionFrom.outputConnections[n].transition == null) {
									this.validate(state.inputConnections[i].connectionFrom.outputConnections[n].connectionTo, false, revalidate);
								} else {
									state.inputConnections[i].connectionFrom.outputConnections[n].transition.validationRules[0].validate(state.inputConnections[i].connectionFrom.outputConnections[n].transition, false, revalidate);
								}
							}
						}
					}
				}
			}
			
			//Revalidate the transitions below us
			if(updateNeighbors) {
				for(var i = 0; i < state.outputConnections.length; i++) {
					if(state.outputConnections[i].transition != null) {
						state.outputConnections[i].transition.validationRules[0].validate(state.outputConnections[i].transition, false, revalidate);
					}
				}	
			}
		}
	}
}