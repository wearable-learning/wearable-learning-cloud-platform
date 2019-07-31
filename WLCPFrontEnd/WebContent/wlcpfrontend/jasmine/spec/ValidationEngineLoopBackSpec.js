describe("A suite to test the Validation Engine Loop Back Mechanisms for both states and transitions", function() {
	it("Self Loopback No Transition No State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();

		expect(outputState.scopeMask).toEqual(1);
	});
	it("Self Loopback No Transition State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var outputState2 = GameEditorTestingHelpers.addState(750, 550);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 0).toBeTruthy();
	});
	it("Loopback No Transition No State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		

		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 8191).toBeTruthy();
	});
	it("Loopback No Transition State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 500);
		var outputState3 = GameEditorTestingHelpers.addState(750, 750);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState3.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();

		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1 && outputState3.scopeMask == 0).toBeTruthy();
	});	
	it("Self Loopback Transition No State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && transition.scopeMask == 1).toBeTruthy();
	});
	it("Self Loopback Transition State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var outputState2 = GameEditorTestingHelpers.addState(750, 550);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && transition.scopeMask == 1 && outputState2.scopeMask == 0).toBeTruthy();
	});
	
	
	it("Loopback Transition No State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection3);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1 && transition.scopeMask == 1).toBeTruthy();
	});
	it("Loopback Transition State Below Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 500);
		var outputState3 = GameEditorTestingHelpers.addState(750, 750);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState3.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection3);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1 && transition.scopeMask == 1 && outputState3.scopeMask == 0).toBeTruthy();
	});	
	it("Self Loopback Transition State Below Single Team (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var outputState2 = GameEditorTestingHelpers.addState(750, 550);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 8078 && transition.scopeMask == 2 && outputState2.scopeMask == 0).toBeTruthy();
	});
	it("Self Loopback Transition State Below Multiple Teams (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var outputState2 = GameEditorTestingHelpers.addState(750, 550);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 7182 && transition.scopeMask == 902 && outputState2.scopeMask == 900).toBeTruthy();
	});
	it("Self Loopback Transition State Below Loops Back (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var outputState2 = GameEditorTestingHelpers.addState(750, 550);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();

		expect(outputState.scopeMask == 7182 && transition.scopeMask == 902 && outputState2.scopeMask == 4).toBeTruthy();
	});
	it("Self Loopback Transition State Below Loop Escapes (3x3)", function () {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var outputState2 = GameEditorTestingHelpers.addState(750, 550);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		var transition2 = GameEditorTestingHelpers.addTransition(connection3);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();

		expect(outputState.scopeMask == 7182 && transition.scopeMask == 902 && transition2.scopeMask == 902 && outputState2.scopeMask == 2).toBeTruthy();
	});
	
	it("Neighbor Loopback Connection Becomes Neighbor Loopback", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(550, 350);
		var outputState2 = GameEditorTestingHelpers.addState(950, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 8191).toBeTruthy();
		
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1).toBeTruthy();
		expect(connection2.isNeighborLoopBack == true).toBeTruthy();
	});
	it("Neighbor Loopback Connection No Longer Neighbor Loopback", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(550, 350);
		var outputState2 = GameEditorTestingHelpers.addState(950, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 8191).toBeTruthy();
		
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1).toBeTruthy();
		expect(connection2.isNeighborLoopBack == true).toBeTruthy();
		
		GameEditorTestingHelpers.removeConnection(connection3);
		expect(connection2.isNeighborLoopBack == false).toBeTruthy();
	})
	
	it("Neighbor Loopback No Transition Start State Game Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(550, 350);
		var outputState2 = GameEditorTestingHelpers.addState(950, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1).toBeTruthy();
	});	
	it("Neighbor Loopback No Transition Start State Team Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(550, 350);
		var outputState2 = GameEditorTestingHelpers.addState(950, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(outputState.scopeMask == 7178 && outputState2.scopeMask == 7182).toBeTruthy();
	});	
	it("Neighbor Loopback No Transition Start State Player Wide (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(550, 350);
		var outputState2 = GameEditorTestingHelpers.addState(950, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(outputState.scopeMask == 8156 && outputState2.scopeMask == 8188).toBeTruthy();
	});
	it("Neighbor Loopback No Transition Start State Game Wide Flip Flop (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(550, 350);
		var outputState2 = GameEditorTestingHelpers.addState(950, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1).toBeTruthy();
	});
	
});