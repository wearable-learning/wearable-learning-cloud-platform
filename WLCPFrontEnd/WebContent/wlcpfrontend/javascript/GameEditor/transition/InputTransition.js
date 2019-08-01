/**
 * 
 */

var InputTransition = class InputTransition extends Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		super(cssClass, connection, overlayId, gameEditor);
		this.create();
		this.modelJSON = {
				iconTabs : []
		}
		this.oldModelJSON = {};
		this.transitionConfigs = [];
		this.setupTransitionConfigs();
		this.modelJSON.iconTabs = this.generateData(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		this.validationRules = [];
		this.setupValidationRules();
		this.scopeMask = 0xffffffff;
		this.oldActiveScopes = [];
	}
	
	create() {
		
		this.jsPlumbConnection = GameEditor.getJsPlumbInstance().getConnections({ source : this.connection.connectionFrom.htmlId, target : this.connection.connectionTo.htmlId})[0];
		
		//Add the overlay
		this.jsPlumbConnection.addOverlay([ "Label", {id : this.overlayId, label: "<div id=" + "\"" + this.overlayId + "_delete\"" + "class=\"close2-thik\"></div><div class=\"centerTransitionText\"/><div>" + sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition").split(" ")[0] + "</div><div>" + sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition").split(" ")[1] + "</div></div>", cssClass : this.cssClass + " jtk-drag-select"}]);
		
		//Store the id
		for(var key in this.jsPlumbConnection.getOverlays()) {
			if(this.jsPlumbConnection.getOverlays()[key].hasOwnProperty("label")) {
				  this.htmlId = this.jsPlumbConnection.getOverlays()[key].canvas.id;
				  break;
			}
		}
		
		//Setup double click
		$("#"+this.htmlId).dblclick($.proxy(this.doubleClick, this));
		
		//Setup delete click
		$("#" + this.overlayId + "_delete").click($.proxy(this.remove, this));
	}
	
	setupTransitionConfigs() {
		this.transitionConfigs.push(new TransitionConfigSingleButtonPress(this));
		this.transitionConfigs.push(new TransitionConfigSequenceButtonPress(this));
		this.transitionConfigs.push(new TransitionConfigKeyboardInput(this));
	}
	
	setupValidationRules() {
		this.validationRules.push(new TransitionValidationRule());
		//this.validationRules.push(new TransitionSelectedTypeValidationRule());
	}
	
	onChange(oEvent) {
		for(var i = 0; i < this.validationRules.length; i++) {
			this.validationRules[i].validate(this);
		}
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			for(var n = 0; n < this.transitionConfigs[i].validationRules.length; n++) {
				this.transitionConfigs[i].validationRules[n].validate(this);
			}
		}
	}
	
	revalidate() {
		for(var i = 0; i < this.validationRules.length; i++) {
			this.validationRules[i].validate(this, true, true);
		}
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			for(var n = 0; n < this.transitionConfigs[i].validationRules.length; n++) {
				this.transitionConfigs[i].validationRules[n].validate(this);
			}
		}
	}
	
	setScope(bitMask, teamCount, playersPerTeam) {
		
		this.scopeMask = bitMask;
		var mask = bitMask;
		var model = this.modelJSON.iconTabs;
		var newTabs = [];
	
		//Test gamewide
		if(bitMask & 0x01) {
			var exists = false;
			for(var i = 0; i < model.length; i++) {
				if(model[i].scope == "Game Wide") {
					exists = true;
					newTabs.push(model[i]);
					break;
				}
			}
			if(!exists) {
				var data = this.createData();
				data.icon = "sap-icon://globe";
				data.scope = "Game Wide";
				data.scopeText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.gameWide");
				newTabs.push(data);
			}
		}
		
		mask = mask >> 1;
		
		for(var i = 0; i < teamCount; i++) {
			if(mask & 0x01) {
				var exists = false;
				for(var n = 0; n < model.length; n++) {
					if(model[n].scope == "Team " + (i + 1)) {
						exists = true;
						newTabs.push(model[n]);
						break;
					}
				}
				if(!exists) {
					var data = this.createData();
					data.icon = "sap-icon://group";
					data.scope = "Team " + (i + 1);
					data.scopeText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.team") + " " + (i + 1);
					newTabs.push(data);
				}
			}	
			mask = mask >> 1;
		}	
		
		for(var i = 0; i < teamCount; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				if(mask & 0x01) {
					var exists = false;
					for(var j = 0; j < model.length; j++) {
						if(model[j].scope == "Team " + (i + 1) + " Player " + (n + 1)) {
							exists = true;
							newTabs.push(model[j]);
							break;
						}
					}
					if(!exists) {
						var data = this.createData();
						data.icon = "sap-icon://employee";
						data.scope = "Team " + (i + 1) + " Player " + (n + 1);
						data.scopeText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.team") + " " + (i + 1) + " " + sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.player") + " " + (n + 1);
						newTabs.push(data);
					}
				}
				mask = mask >> 1;
			}
		}
		
		this.modelJSON.iconTabs = newTabs;
		this.model.setData(this.modelJSON);
		
		if(typeof sap.ui.getCore().byId("inputTransitionDialogIconTabBar") !== "undefined") {
			var iconTabBar = sap.ui.getCore().byId("inputTransitionDialogIconTabBar").getItems();
			for(var i = 0; i < iconTabBar.length; i++) {
				for(var n = 0; n < iconTabBar[i].getContent()[0].getContentAreas()[1].getPages().length; n++) {
					var iconTabBarPage = iconTabBar[i].getContent()[0].getContentAreas()[1].getPages()[n];
					if(iconTabBarPage.getContent().length == 0) {
						var fragment = this.transitionConfigs[n].getTransitionConfigFragment();
						if(typeof fragment === 'object' && fragment.constructor === Array) {
							fragment.forEach(function (oElement) {iconTabBarPage.addContent(oElement);});
						} else {
							iconTabBarPage.addContent(fragment);
						}
					}
					iconTabBarPage.setTitle(iconTabBar[i].getProperty("text") + " " + this.transitionConfigs[n].getNavigationContainerPage().title);
				}
			}
		}
	}
	
	static load(loadData) {
		
		var connection = null;
		
		//Get the connection is transition should be placed on
		for(var n = 0; n < GameEditor.getEditorController().jsPlumbInstance.getConnections().length; n++) {
			if(GameEditor.getEditorController().jsPlumbInstance.getConnections()[n].id == loadData.connection) {
				connection = GameEditor.getEditorController().jsPlumbInstance.getConnections()[n];
				break;
			}
		}
		
		if(typeof loadData.connection !== "undefined") {
			for(var i = 0; i < GameEditor.getEditorController().connectionList.length; i++) {
				if(GameEditor.getEditorController().connectionList[i].connectionId == loadData.connection.connectionId) {
					connection = GameEditor.getEditorController().connectionList[i];
					connection.connectionFrom = { htmlId : connection.connectionFrom };
					connection.connectionTo = { htmlId : connection.connectionTo };
					break;
				}
			}
		}
		
		//Place the transition
		var inputTransition = new InputTransition("transition", connection, loadData.transitionId, this);
		GameEditor.getEditorController().transitionList.push(inputTransition);
		
		//Load the component data
		inputTransition.loadComponents(loadData);
	}
	
	loadComponents(loadData) {
		for(var key in loadData.activeTransitions) {
			for(var n = 0; n < this.modelJSON.iconTabs.length; n++) {
				if(key == this.modelJSON.iconTabs[n].scope) {
					this.modelJSON.iconTabs[n].activeTransition = loadData.activeTransitions[key];
				}
			}
		}
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			this.transitionConfigs[i].setLoadData(loadData, this.modelJSON.iconTabs);
		}
	}
	
	save() {
		var activeTransitions = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			activeTransitions[this.modelJSON.iconTabs[i].scope] = this.modelJSON.iconTabs[i].activeTransition;
		}
		
		var saveData = {
			transitionId : this.overlayId,
			connection : {
				connectionId : this.connection.connectionId
			},
			activeTransitions : activeTransitions,
		}
		
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			var data = this.transitionConfigs[i].getSaveData();
			for(var key in data) {
				saveData[key] = data[key];
			}
		}
		
		return saveData;
	}
	
	doubleClick() {
		if(this.scopeMask == 0){
			sap.m.MessageBox.error(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.emptyState"));
			return;
		}
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransition", this);
		
		//Set the model for the dialog
		this.dialog.setModel(this.model);
		
		//Setup the state config pages + models
		var iconTabBar = sap.ui.getCore().byId("inputTransitionDialogIconTabBar").getItems();
		for(var i = 0; i < iconTabBar.length; i++) {
			for(var n = 0; n < iconTabBar[i].getContent()[0].getContentAreas()[1].getPages().length; n++) {
				var iconTabBarPage = iconTabBar[i].getContent()[0].getContentAreas()[1].getPages()[n];
				if(iconTabBarPage.getContent().length == 0) {
					var fragment = this.transitionConfigs[n].getTransitionConfigFragment();
					if(typeof fragment === 'object' && fragment.constructor === Array) {
						fragment.forEach(function (oElement) {iconTabBarPage.addContent(oElement);});
					} else {
						iconTabBarPage.addContent(fragment);
					}
				}
				iconTabBarPage.setTitle(iconTabBar[i].getProperty("text") + " " + this.transitionConfigs[n].getNavigationContainerPage().title);
			}
		}
		
		//Set the old scope mask
		this.oldModelJSON = JSON.parse(JSON.stringify(this.modelJSON));
		
		//Set the old active scopes
		this.oldActiveScopes = this.getActiveScopes();
		
		//Set the on after rendering
		this.dialog.onAfterRendering = $.proxy(this.onAfterRenderingDialog, this);
			
		//Open the dialog
		this.dialog.open();
	}
	
	onAfterRenderingDialog() {
		for(var i = 0; i < sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems().length; i++) {
			var navContainer = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1];
			var path = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getBindingContext().getPath() + "/activeTransition";
			var activeTransition = this.model.getProperty(path);
			var transitionTypes = this.model.getProperty(sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getBindingContext().getPath() + "/navigationListItems");
			for(var n = 0; n < transitionTypes.length; n++) {
				if(transitionTypes[n].title == activeTransition) { transitionTypes[n].selected = true; }
				else { transitionTypes[n].selected = false; }
			}
			this.model.setProperty(sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getBindingContext().getPath() + "/navigationListItems", transitionTypes);
			for(var n = 0; n < navContainer.getPages().length; n++) {
				if(navContainer.getPages()[n].getTitle().includes(activeTransition)) {
					navContainer.to(navContainer.getPages()[n]);
					break;
				}
			}
		}
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			this.transitionConfigs[i].onAfterRenderingDialog();
		}
	}
	
	createData() {
		var tempNavigationListItems = [];
		var tempNavigationContainerPages = [];
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			tempNavigationListItems.push(this.transitionConfigs[i].getNavigationListItem());
			tempNavigationContainerPages.push(this.transitionConfigs[i].getNavigationContainerPage());
		}
		return {
			icon : "",
			scope : "",
			scopeText : "",
			activeTransition : sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.singleButtonPress"),
			navigationListItems : tempNavigationListItems,
			navigationContainerPages : tempNavigationContainerPages
		}
	}
	
	generateData(teams, playersPerTeam) {
		
		//Create a new object to store the data
		var baseData = [];

		//Add game wide
		var data = this.createData();
		data.icon = "sap-icon://globe";
		data.scope = "Game Wide";
		data.scopeText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.gameWide");
		baseData.push(data);
		
		//Add the teams
		for(var i = 0; i < teams; i++) {
			data = this.createData();
			data.icon = "sap-icon://group";
			data.scope = "Team " + (i + 1);
			data.scopeText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.team") + " " + (i + 1);
			baseData.push(data);
		}
		
		//Add the players
		for(var i = 0; i < teams; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				data = this.createData();
				data.icon = "sap-icon://employee";
				data.scope = "Team " + (i + 1) + " Player " + (n + 1);
				data.scopeText = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.team") + " " + (i + 1) + " " + sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.player") + " " + (n + 1);
				baseData.push(data);
			}
		}
		
		return baseData;
	}
	
	transitionTypeSelected(oEvent, oParam) {
		this.model.setProperty(oEvent.getSource().getBindingContext() + "/activeTransition", oEvent.getParameters().listItem.getTitle());
		var transitionTypes = this.model.getProperty(oEvent.getSource().getBindingContext() + "/navigationListItems");
		for(var i = 0; i < transitionTypes.length; i++) {
			if(transitionTypes[i].title == oEvent.getParameters().listItem.getTitle()) { transitionTypes[i].selected = true; }
			else { transitionTypes[i].selected = false; }
		}
		this.model.setProperty(oEvent.getSource().getBindingContext() + "/navigationListItems", transitionTypes);
		var navContainer = oEvent.oSource.getParent().getContentAreas()[1];
		for(var i = 0; i < navContainer.getPages().length; i++) {
			if(navContainer.getPages()[i].getTitle().includes(oEvent.getParameters().listItem.getTitle())) {
				navContainer.to(navContainer.getPages()[i]);
				break;
			}
		}
	}
	
    acceptDialog() {
    	if(JSON.stringify(this.oldActiveScopes) != JSON.stringify(this.getActiveScopes())) {
    		sap.m.MessageBox.confirm(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.validationEngine"), {title:sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.validation.title"), onClose : $.proxy(this.acceptRevalidation, this)});
    		return;
    	}
		this.validationRules[0].validate(this, true, true);
		this.dialog.close();
		this.dialog.destroy();
		DataLogger.logGameEditor();
    }
    
    acceptRevalidation(oEvent) {
    	if(oEvent == sap.m.MessageBox.Action.OK) {
    		this.validationRules[0].validate(this, true, true);
    		this.dialog.close();
    		this.dialog.destroy();
    		DataLogger.logGameEditor();
    	}
    }
	
	closeDialog() {
		this.modelJSON = JSON.parse(JSON.stringify(this.oldModelJSON));
		this.model.setData(this.modelJSON);
		this.dialog.close();
		this.dialog.destroy();
		DataLogger.logGameEditor();
	}
	
	remove() {
		
		//Open a dialog so the user can confirm the delete
		sap.m.MessageBox.confirm(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.inputTransition.remove"), {onClose : $.proxy(this.removeTransition, this)});
	}
	
	removeTransition(oAction) {
		
		//If they click OK, delete
		if(oAction == sap.m.MessageBox.Action.OK) {
			
			//Remove the overlay
			this.jsPlumbConnection.removeOverlay(this.overlayId);
			
			//Remove it from the list
			GameEditor.getEditorController().transitionList.splice(GameEditor.getEditorController().transitionList.indexOf(this), 1);
			
			//Remove the connections pointer to us
			this.connection.transition = null;
			
	    	//Revalidate the transitions
	    	for(var i = 0; i < GameEditor.getEditorController().transitionList.length; i++) {
	    		for(var n = 0; n < GameEditor.getEditorController().transitionList[i].validationRules.length; n++) {
	    			GameEditor.getEditorController().transitionList[i].validationRules[n].validate(GameEditor.getEditorController().transitionList[i]);
	    		}
	    	}
	    	
	    	//Revalidate the states
	    	for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
	    		if(!GameEditor.getEditorController().stateList[i].htmlId.includes("start")) {
	        		for(var n = 0; n < GameEditor.getEditorController().stateList[i].validationRules.length; n++) {
	        			GameEditor.getEditorController().stateList[i].validationRules[n].validate(GameEditor.getEditorController().stateList[i]);
	        		}
	    		}
	    	}
	    	
	    	//Log it
	    	DataLogger.logGameEditor();
		}
	}
	
	getActiveScopes() {
		var activeScopes = [];
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			var tempActiveScopes = this.transitionConfigs[i].getActiveScopes();
			for(var n = 0; n < tempActiveScopes.length; n++) {
				if(activeScopes.indexOf(tempActiveScopes[n]) == -1) {
					activeScopes.push(tempActiveScopes[n]);
				}
			}
		}
		return activeScopes;
	}
	
	getFullyActiveScopes(neighborTransitions) {
		var activeScopes = [];
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			var tempActiveScopes = this.transitionConfigs[i].getFullyActiveScopes(neighborTransitions);
			for(var n = 0; n < tempActiveScopes.length; n++) {
				if(activeScopes.indexOf(tempActiveScopes[n]) == -1) {
					activeScopes.push(tempActiveScopes[n]);
				}
			}
		}
		return activeScopes;
	}
}