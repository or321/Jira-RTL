import browser from "webextension-polyfill";

const DEFAULT_SETTINGS = {
	enabled: true
};

export async function loadSettings() {
	const result = await browser.storage.sync.get("Jira_RTL_settings");
	return { ...DEFAULT_SETTINGS, ...(result.Jira_RTL_settings || {}) };
}

export async function saveSettings(settings) {
	await browser.storage.sync.set({ Jira_RTL_settings: settings });
}