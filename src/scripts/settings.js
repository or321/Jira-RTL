import merge from "deepmerge";

export const DEFAULT_SETTINGS = {
	enabled: true
};

export async function loadSettings() {
	const result = await browser.storage.sync.get("Jira_RTL_settings");
	const storedSettings = result.Jira_RTL_settings || {};
	
	return merge(DEFAULT_SETTINGS, storedSettings);
}

export async function saveSettings(settings) {
	await browser.storage.sync.set({ Jira_RTL_settings: settings });
}