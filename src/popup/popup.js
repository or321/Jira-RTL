import { loadSettings } from "./settings-popup";

// Loading settings

document.addEventListener("DOMContentLoaded", () => {
	loadSettings((settings) => {
		document.getElementById("enabledToggle").checked = settings.enabled;
	});
});

// On changing a setting

document.getElementById("enabledToggle").addEventListener("change", (e) => {
	loadSettings((settings) => {
		settings.enabled = e.target.checked;
		chrome.storage.sync.set({ JiraRTL_settings: settings });

		// Notify all Jira tabs
		chrome.tabs.query({ url: "*://*.atlassian.net/*" }, (tabs) => {
			for (const tab of tabs) {
				chrome.tabs.sendMessage(tab.id, {
					from: "JiraRTL_popup",
					type: settings.enabled ? "JiraRTL_enable" : "JiraRTL_disable"
				});
			}
		});
	});
});