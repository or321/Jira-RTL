// This file should be identical to /src/popup/settings-popup.js

const DEFAULT_SETTINGS = {
	enabled: true
};

export function loadSettings(callback) {
	chrome.storage.sync.get(["JiraRTL_settings"], (result) => {
		const settings = Object.assign({}, DEFAULT_SETTINGS, result.JiraRTL_settings);
		callback(settings);
	});
}