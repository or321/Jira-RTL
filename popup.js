//import "./scripts/compatibility";
//import { loadSettings } from "./scripts/settings";

if (typeof browser === "undefined") {
	window.browser = chrome;
}

const DEFAULT_SETTINGS = {
	enabled: true
};

export function loadSettings(callback) {
	browser.storage.sync.get(["JiraRTL_settings"], (result) => {
		const settings = Object.assign({}, DEFAULT_SETTINGS, result.JiraRTL_settings);
		callback(settings);
	});
}

// Loading settings

document.addEventListener("DOMContentLoaded", () => {
	loadSettings((settings) => {
		document.getElementById("enabledToggle").checked = settings.enabled;
	});
});

// On changing a setting

document.getElementById("enabledToggle").addEventListener("change", (e) => {
	loadSettings((settings) => {
		debugger;
		settings.enabled = e.target.checked;
		browser.storage.sync.set({ JiraRTL_settings: settings });

		// Notify all Jira tabs
		browser.tabs.query({ url: "*://*.atlassian.net/*" }, (tabs) => {
			for (const tab of tabs) {
				browser.tabs.sendMessage(tab.id, {
					from: "JiraRTL_popup",
					type: settings.enabled ? "JiraRTL_enable" : "JiraRTL_disable"
				});
			}
		});
	});
});