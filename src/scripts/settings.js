// This file should be identical to /src/popup/settings-popup.js

const DEFAULT_SETTINGS = {
	enabled: true
};

export function loadSettings(callback) {
	chrome.storage.sync.get(["Jira_RTL_settings"], (result) => {
		const settings = Object.assign({}, DEFAULT_SETTINGS, result.Jira_RTL_settings);
		callback(settings);
	});
}