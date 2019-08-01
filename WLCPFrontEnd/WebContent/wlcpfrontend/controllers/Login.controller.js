sap.ui.controller("wlcpfrontend.controllers.Login", {
	
	modelData : {
		username : "",
		password : "",
		mode : "",
		items : [
			{
				text : ""
			},
			{
				text : ""
			}, 
			{
				text : ""
			}
		],
		newUser : {
			UsernameId : "",
			Password : "",
			FirstName : "",
			LastName : "",
		}
	},
	
	model : new sap.ui.model.json.JSONModel(),
	
	userModelData : {
		username: ""
	},
	
	newUserModelData : {
		username: ""
	},
	
	userModel : new sap.ui.model.json.JSONModel(),
	newUserModel : new sap.ui.model.json.JSONModel(),
	
	onLoginPress: function() {
		this.userModelData.username = this.modelData.username.toLowerCase();
		this.userModel.setData(this.userModelData);
		switch(this.modelData.mode) {
		case sap.ui.getCore().getModel("i18n").getResourceBundle().getText("mode.gameManager"): 
			Index.switchToGameManager();
			break;
		case sap.ui.getCore().getModel("i18n").getResourceBundle().getText("mode.gameEditor"):
			Index.switchToGameEditor();
			Index.gameEditorPage.getController().quickStartHelp();
			//Index.gameEditorPage.getController().quickStartCookie();
			break;
		case sap.ui.getCore().getModel("i18n").getResourceBundle().getText("mode.gamePlayer"):
			Index.switchToGamePlayer();
			Index.gamePlayerPage.getController().debugMode = false;
			Index.gamePlayerPage.getController().initVirtualDevice();
			break;
		default:
			break;
		}
	},
	
	validateLogin : function() {
		var oDataModel = ODataModel.getODataModel();
		this.newUserModelData.username = this.modelData.username.toLowerCase();
		//this.newUserModelData.password = this.modelData.password;
		this.newUserModel.setData(this.newUserModelData);
		
		$.ajax({headers : { 'Accept': 'application/json', 'Content-Type': 'application/json'},
			url: ODataModel.getWebAppURL() + "/Rest/Controllers/userLogin",
			type: 'POST',
			dataType: 'json',
			data: this.newUserModel.getJSON(),
			success : $.proxy(this.oDataSuccess, this),
			error : $.proxy(this.oDataError, this)
		});
	},
	
	oDataSuccess : function(oData) {
		var usernameFound = false;
		
		if(oData!=null && oData == true) {
			
			this.onLoginPress();
			usernameFound = true;
			
		}
		
		if(!usernameFound) {
			sap.m.MessageBox.error(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("login.message.incorrectLogin"));
		}
	},
	
	oDataError : function(oData) {
		sap.m.MessageBox.error(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("login.message.validationError"));
	},
	
	registerNewUser : function() {
		
		//Load username data
		ODataModel.getODataModel().read("/Usernames");
		
		//Create an instance of the dialog
		this.registerNewUserDialog = sap.ui.xmlfragment("wlcpfrontend.fragments.RegisterNewUser", this);
		
		//Set the model for the dialog
		this.registerNewUserDialog.setModel(this.model);
		
		//Open the dialog
		this.registerNewUserDialog.open();
	},
	
	confirmRegisterNewUser : function() {
		var registerData = this.model.getData().newUser;
		
		//Make sure username and password are filled out
		if(registerData.UsernameId == "" || registerData.Password == "") {
			sap.m.MessageBox.error(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("register.message.fill"));
			return;
		}
		
		//Make sure a-z A-Z only
		if(!registerData.UsernameId.match(/^[a-zA-Z]+$/)) {
			sap.m.MessageBox.error(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("register.message.usernameRequirements"));
			return;
		}
		
		//Check to make sure that username doesnt already exist
		if(typeof ODataModel.getODataModel().getProperty("/Usernames('" + registerData.UsernameId + "')") !== "undefined") {
			sap.m.MessageBox.error(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("register.message.duplicateUsername"));
			return;
		}
		
		//Convert the username to all lower case
		registerData.UsernameId = registerData.UsernameId.toLowerCase();
		
		//If we get here we can register them
		ODataModel.getODataModel().create("/Usernames", registerData, {success : $.proxy(this.registerSuccess, this), error : $.proxy(this.registerError, this)});
	},
	
	registerSuccess : function() {
		sap.m.MessageBox.success(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("register.message.success"));
		this.cancelRegisterNewUser();
	},
	
	registerError : function() {
		
	},
	
	cancelRegisterNewUser : function() {
		this.registerNewUserDialog.close();
		this.registerNewUserDialog.destroy();
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.Login
*/
	onInit: function() {
		
		//Set the data to the model
		this.model.setData(this.modelData);
		this.getView().setModel(this.model);
		
		this.userModel.setData(this.userModelData);
		sap.ui.getCore().setModel(this.userModel, "user");
		
		//Setup the ODATA
		ODataModel.setupODataModel();
		
		this.getView().addEventDelegate({
			  onAfterRendering: function(){
				    //this.onLoginPress();
					this.modelData.items[0].text = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("mode.gameManager");
					this.modelData.items[1].text = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("mode.gameEditor");
					this.modelData.items[2].text =sap.ui.getCore().getModel("i18n").getResourceBundle().getText("mode.gamePlayer");
					this.model.setData(this.modelData);
					this.getView().setModel(this.model);
			  }
			}, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.Login
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.Login
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.Login
*/
//	onExit: function() {
//
//	}

});