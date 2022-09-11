const popup = {};

popup.init = () => {
	popup.debug.init();
}

popup.choices = {
	today: {}
}

popup.debug = {
	set lastMessage(msg) {
		$("#msg").text(msg);
		console.log(msg);
	},
	init: () => {
		$("#debug-dialog").click(() => {
			chrome.runtime.sendMessage({ debug: "dialog" });
		});
		$("#debug-clear").click(() => {
			chrome.runtime.sendMessage({ debug: "clear" });
		});
		$("#c-yes-btn").click(() => {
			chrome.runtime.sendMessage({ debug: { choice: "yes" } });
		});
		$("#c-no-btn").click(() => {
			chrome.runtime.sendMessage({ debug: { choice: "no" } });
		});
		$("#c-ignore-btn").click(() => {
			chrome.runtime.sendMessage({ debug: { choice: "ignore" } });
		});

		chrome.runtime.onMessage.addListener((request) => {
			popup.debug.lastMessage = JSON.stringify(request);

			if (request.choices) popup.debug.updateChoiceButtons(request.choices);
		});

		chrome.runtime.sendMessage("getChoices", (response) => {
			popup.debug.lastMessage = JSON.stringify(response);

			if (response.choices) popup.debug.updateChoiceButtons(response.choices);
		});
	},
	updateChoiceButtons: (data) => {
		const date = new Date().toISOString().split("T")[0];
		const currData = data[date] || {}; // Get today's data, or empty

		//TODO Needs a touch-up
		$("#c-yes").text(currData["yes"] || "-");
		$("#c-no").text(currData["no"] || "-");
		$("#c-ignore").text(currData["ignore"] || "-");

		popup.choices.today = currData;
	}
}

popup.init();