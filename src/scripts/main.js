import { loadSettings, DEFAULT_SETTINGS } from "./settings";
import { rtlObserver } from "./rtlObserver"
import "../styles/rtl.css"

let currentSettings = null;

function injectRTLStylesheet() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = browser.runtime.getURL('assets/jira-rtl.css');
	document.head.appendChild(link);
}

function runWhenReady(callback) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", callback);
	} else {
		// DOM already loaded, run immediately
		callback();
	}
}

// Handlers for individual settings
const settingHandlers = {
	enabled: (newValue, oldValue) => {
		if (newValue === oldValue) return;

		if (newValue) {
			console.log("Jira_RTL enabled, starting a new scan");
			rtlObserver.initialize();
		}
		else {
			console.log("Jira_RTL disabled, starting cleanup");
			rtlObserver.cleanup();
		}
	},
};

async function applySettings(settings) {
	for (const key of Object.keys(settings)) {
		if (settingHandlers[key]) {
			settingHandlers[key](settings[key], currentSettings[key]);
		}
	}

	currentSettings = settings;
}

async function initialize() {
	injectRTLStylesheet();
	let settings = await loadSettings();
	currentSettings = settings;

	if (settings.enabled) {
		console.log("Jira_RTL - running initial scan");
		rtlObserver.initialize();
	}
}

runWhenReady(initialize);

// run a post-load scan in case the first initial scan missed something
window.addEventListener("load", () => {
	setTimeout(async () => {
		const settings = await loadSettings();

		if (settings.enabled) {
			console.log("Jira_RTL - running a post-load scan");
			rtlObserver.runScan();
		}
	}, 4000);
});

// Listen for storage changes
browser.storage.onChanged.addListener((changes, area) => {
	// Ensure the storage changes came from the Jira-RTL extension only
	if (area !== "sync") return;
	if (!changes.Jira_RTL_settings) return;
	
	const newSettings = {
		...DEFAULT_SETTINGS,
		...(changes.Jira_RTL_settings.newValue || {}),
	};

	applySettings(newSettings);
});

console.log("Jira_RTL extension loaded");