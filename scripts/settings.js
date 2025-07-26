const DEFAULT_SETTINGS = {
	enabled: true
};

export function loadSettings(callback) {
	browser.storage.sync.get(["JiraRTL_settings"], (result) => {
		const settings = Object.assign({}, DEFAULT_SETTINGS, result.JiraRTL_settings);
		callback(settings);
	});
}