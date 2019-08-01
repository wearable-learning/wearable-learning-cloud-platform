var TransitionConfigKeyboardInput = class TransitionConfigKeyboardInput extends TransitionConfig {
	
	constructor(transition) {
		super(transition);
		this.validationRules.push(new SingleButtonPressValidationRule());
	}
	
	getNavigationListItem() {
		return {
			title : sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput"),
			icon : "sap-icon://keyboard-and-mouse",
			selected : false,
			visible : true
		}
	}
	
	getNavigationContainerPage() {
		return {
			title : sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput"),
			keyboardField : []
		}
	}
	
	getTransitionConfigFragment() {
		return sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransitionKeyboardInputConfig", this);
	}
	
	getActiveScopes() {
		var activeScopes = [];
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput")) {
					if(iconTabs[i].navigationContainerPages[n].keyboardField.length > 0) {
						activeScopes.push(iconTabs[i].scope);
					}
				}
			}
		}
		return activeScopes;
	}
	
	getFullyActiveScopes(neighborTransitions) {
		var scopeCollection = [];
		var activeScopes = [];
		return activeScopes;
	}
	
	setLoadData(loadData) {
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var key in loadData.keyboardInputs) {
			for(var i = 0; i < iconTabs.length; i++) {
				if(key == iconTabs[i].scope) {
					for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
						if(iconTabs[i].navigationContainerPages[n].title == sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput")) {
							for(var k = 0; k < loadData.keyboardInputs[key].keyboardInputs.length; k++) {
								iconTabs[i].navigationContainerPages[n].keyboardField.push({value: loadData.keyboardInputs[key].keyboardInputs[k]});
							}
						}
					}
				}
			}
		}
	}
	
	getSaveData() {
		var keyboardInputs = {};
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput")) {
					var keyboardInputStrings = [];
					for(var k = 0; k < iconTabs[i].navigationContainerPages[n].keyboardField.length; k++) {
						keyboardInputStrings.push(iconTabs[i].navigationContainerPages[n].keyboardField[k].value);
					}
					if(keyboardInputStrings.length > 0) {
						keyboardInputs[iconTabs[i].scope] = {
							transition : { transitionId : this.transition.overlayId },
							scope : iconTabs[i].scope,
							keyboardInputs : keyboardInputStrings
						}
					}
				}
			}
		}
		return {
			keyboardInputs : keyboardInputs
		};
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
	
	addKeyboardField(oEvent) {
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.KeyboardInput", this);
			
		//Open the dialog
		this.dialog.open();
		
		//Store the scopes path
		this.path23 = oEvent.getSource().getParent().getParent().getContent()[1].getBindingContext().getPath();
	}
	
	closeKeyboardInput(oEvent) {
		var keyboardInputValue = sap.ui.getCore().byId("keyboardInput").getValue().toLowerCase();
		var keyboardValidation = new TransitionKeyboardInputValidationRule();
		if(!keyboardValidation.validate(this.transition, keyboardInputValue, this.transition.model.getProperty(this.path23).scope)) {
			sap.m.MessageBox.error(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput.alreadyExists"));
		} else {
			if(keyboardInputValue == "") {
				sap.m.MessageBox.information(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput.emptyInput"));
			}
			var data = this.transition.model.getProperty(this.path23 + "/keyboardField");
			data.push({value : keyboardInputValue});
			this.transition.model.setProperty(this.path23 + "/keyboardField", data);
			this.transition.onChange();
			this.closeDialog();
		}
	}
	
	deleteKeyboardField(oEvent) {
		this.deletePath = oEvent.getSource().getBindingContext().getPath();
		this.deleteKeyboardPath = oEvent.getSource().getParent().getParent().getParent().getBindingContext().getPath() + "/keyboardField";
		sap.m.MessageBox.confirm(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.keyboardInput.remove"), {onClose : $.proxy(this.keyboardDeleteOnClose, this)});
	}
	
	keyboardDeleteOnClose(oEvent) {
		if(oEvent == "OK") {
			var splitPath = this.deletePath.split("/");
			var index = parseInt(splitPath[splitPath.length - 1]);
			var sequenceArray = this.transition.model.getProperty(this.deleteKeyboardPath);
			sequenceArray.splice(index, 1);
			this.transition.model.setProperty(this.deleteKeyboardPath, sequenceArray);
			this.transition.onChange();
		}
	}

}

var TransitionKeyboardInputValidationRule = class TransitionKeyboardInputValidationRule extends ValidationRule {
	
	validate(transition, keyboardInput, scope) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.connectionFrom.htmlId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.connectionId) {
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