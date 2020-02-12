var StateConfigDisplayPhoto = class StateConfigDisplayPhoto extends StateConfig {
	
	constructor(state) {
		super(state);
		this.displayPhotoPage = null;
	}
	
	//side bar in configure window list of available states
	getNavigationListItem() {
		return {	
			text : sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.outputState.displayPhoto"),
			icon : "sap-icon://picture"	
		}
	}
	
	//return title of page
	getNavigationContainerPage() {
		return {
			title : sap.ui.getCore().getModel("i18n").getResourceBundle().getText("gameEditor.outputState.displayPhoto"),
			url : "",
			scale : 50,
			scalingString : "50%",
			height : 0,
			width : 0
		}
	}
	
	openImageUpload() {
		window.open("https://imgur.com/upload");
	}
	
	updateScalingString(oEvent) {
		var iconTabs = this.state.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			if(iconTabs[i].scope == sap.ui.getCore().byId("outputStateDialogIconTabBar").getSelectedKey()) {
				for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
					if(iconTabs[i].navigationContainerPages[n].title == this.getNavigationContainerPage().title) {
						this.displayPhotoPage = iconTabs[i].navigationContainerPages[n];
						var img = new Image();
						img.addEventListener("load", $.proxy(function() {
							this.displayPhotoPage.height = img.naturalHeight * (this.displayPhotoPage.scale/100);
							this.displayPhotoPage.width = img.naturalWidth * (this.displayPhotoPage.scale/100);
							this.state.model.setData(this.state.modelJSON);
						}, this));
						img.src = iconTabs[i].navigationContainerPages[n].url;
					}
				}
			}
		}
	}
	
	
	//put XML code here
	getStateConfigFragment() {
		return sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.States.OutputStateDisplayPhotoConfig", this);
	}
	
	
	//returns verified scopes Team 1, Player 2, Game Wide ect
	getActiveScopes() {
		var activeScopes = [];
		var iconTabs = this.state.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == this.getNavigationContainerPage().title) {
					if(iconTabs[i].navigationContainerPages[n].url != "") {
						activeScopes.push(iconTabs[i].scope);
					}
				}
			}
		}
		return activeScopes;
	}
	
	//not sure, loading previous data maybe?
	setLoadData(loadData) {
		var iconTabs = this.state.modelJSON.iconTabs;
		for(var key in loadData.pictureOutputs) {
			for(var i = 0; i < iconTabs.length; i++) {
				if(key == iconTabs[i].scope) {
					for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
						if(iconTabs[i].navigationContainerPages[n].title == this.getNavigationContainerPage().title) {
							iconTabs[i].navigationContainerPages[n].url = loadData.pictureOutputs[key].url;
							iconTabs[i].navigationContainerPages[n].scale = loadData.pictureOutputs[key].scale;
							this.displayPhotoPage = iconTabs[i].navigationContainerPages[n];
							var img = new Image();
							img.addEventListener("load", $.proxy(function() {
								this.displayPhotoPage.height = img.naturalHeight * (this.displayPhotoPage.scale/100);
								this.displayPhotoPage.width = img.naturalWidth * (this.displayPhotoPage.scale/100);
								this.state.model.setData(this.state.modelJSON);
							}, this));
							img.src = iconTabs[i].navigationContainerPages[n].url;
						}
					}
					
				}
			}
		}
	}
	
	//when the user clicks accept?
	getSaveData() {
		var outputStateData = {};
		var iconTabs = this.state.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == this.getNavigationContainerPage().title) {
					if(iconTabs[i].navigationContainerPages[n].url != "") {
						outputStateData[iconTabs[i].scope] = {
							    url : iconTabs[i].navigationContainerPages[n].url,
							    scale : iconTabs[i].navigationContainerPages[n].scale
							}
					}
				}
			}
		}
		return {
			pictureOutputs : outputStateData
		};
	}
}