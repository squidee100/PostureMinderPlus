const app = {};

app.init = () => {
	// app.reminder.init();
	app.storage.init();
	app.listeners.init();
}

app.reminder = {
	init: () => {
		chrome.alarms.create("reminder", { delayInMinutes: 0.1, periodInMinutes: 0.1 });

		chrome.alarms.onAlarm.addListener(function (alarm) {
			if (alarm.name == "reminder") {
				app.reminder.display();
			}
		});
	},
	display: () => {
		const options = {
			type: "basic",
			title: "Posture Check!",
			message: "Were you sitting up straight?",
			iconUrl: "/img/spine.png",
			buttons: [{ title: "Yes" }, { title: "No" }],
			requireInteraction: false
		};

		chrome.notifications.getPermissionLevel(function (permission) {
			if (permission === "granted") {
				chrome.notifications.create("notification", options);

				setTimeout(function () {
					chrome.notifications.clear("notification");
				}, 5000);
			}
		});
	}
}

app.storage = {
	init: () => {

	},
	data: async () => {
		let keys = await chrome.storage.sync.get(null);
		return keys;
	},
	increment: async (key) => {
		let data = await app.storage.data();
		val = data[key] || 0;

		let newVal = val + 1;

		chrome.storage.sync.set({ [key]: newVal });

		console.log(`Updated '${key}' (${val} => ${newVal})`);
	}
}

app.listeners = {
	init: () => {
		chrome.runtime.onMessage.addListener((msg) => {
			if (msg == "debug") app.reminder.display();
		});

		chrome.notifications.onButtonClicked.addListener(function (id, i) {
			if (id === "notification") {
				if (i === 0) {
					app.storage.increment("c-yes");
				} else if (i === 1) {
					app.storage.increment("c-no");
				}
			}
		});
	}
}

app.init();