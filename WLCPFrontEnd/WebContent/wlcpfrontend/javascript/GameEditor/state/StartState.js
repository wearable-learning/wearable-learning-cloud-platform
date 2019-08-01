/**
 * 
 */

var StartState = class StartState extends State {
	
	constructor(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance) {
		super(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance);
		this.outputEndPoint = {
				 endpoint:"Dot",
				 isTarget:false,
				 isSource:true,
				 maxConnections: -1,
			};
		this.create();
	}
	
	create() {
		
		//Call the super method
		super.create();
		
		//Setup the end points
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "output", anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
		
		//Setup double click
		$("#"+this.stateDiv.id).dblclick($.proxy(this.explainWindow, this));
	}
	
	static load(loadData) {
		//Create a new start state
		var startState = new StartState("startStateTopColor", "startStateBottomColor", sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.startState") , loadData.stateId, GameEditor.getEditorController().jsPlumbInstance);
		
		//Set the position
		startState.setPositionX(loadData.positionX); startState.setPositionY(loadData.positionY);
		
		//Redraw it
		startState.draw();
		
		//Push back the state
		GameEditor.getEditorController().stateList.push(startState);
	}
	
	save() {
		var tempOutputConnections = [];
		for(var i = 0; i < this.outputConnections.length; i++) {
			tempOutputConnections.push({
				connectionId : this.outputConnections[i].connectionId
			});
		}
		var saveData = {
			stateId : this.htmlId,
			positionX : this.positionX,
			positionY : this.positionY,
			stateType : "START_STATE",
			inputConnections : [],
			outputConnections : tempOutputConnections
		}
		return saveData;
	}
	
	onChange(oEvent) {
		
	}
	
	getActiveScopes() {
		return ["Game Wide"];
	}
	
	explainWindow(){
		sap.m.MessageBox.information(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.state.startExplain"));
		return;
	}
}