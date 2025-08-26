import { loadSettings } from "../utils/settings";
import { rtlObserver } from "./rtlObserver"
import "../styles/rtl.css"

/** @type {import("../utils/settings").ExtensionSettings | null} */
let currentSettings = null;

/**
 * Injects the extension stylesheet into the document head, 
 * to apply custom styles on elements with RTL applied.
 */
function injectRTLStylesheet() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = browser.runtime.getURL('assets/jira-rtl.css');
	document.head.appendChild(link);
}

/**
 * Runs a callback when the DOM is ready.
 * If the document is already loaded, the callback runs immediately.
 *
 * @param {() => void} callback - Function to run once DOM is ready.
 */
function runWhenReady(callback) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", callback);
	} else {
		// DOM already loaded, run immediately
		callback();
	}
}

/**
 * A map of setting keys to their change-handlers.
 * Each handler is called when its respective setting changes.
 *
 * @type {Record<string, (newValue: any, oldValue: any) => void>}
 */
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

/**
 * Applies settings by running change-handlers
 * for any modified setting value, and update current settings.
 *
 * @param {import("../utils/settings").ExtensionSettings} settings - The new settings object.
 */
async function applySettings(settings) {
	for (const key of Object.keys(settings)) {
		if (settingHandlers[key]) {
			settingHandlers[key](settings[key], currentSettings[key]);
		}
	}

	currentSettings = structuredClone(settings);
}

/**
 * Initializes the extension:
 * - Injects stylesheet
 * - Loads settings
 * - Starts observer if the extension is enabled
 */
async function initialize() {
	injectRTLStylesheet();
	const settings = await loadSettings();

	currentSettings = structuredClone(settings);

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

/**
 * Listen for storage changes and re-apply settings
 * if the Jira-RTL sync storage key was updated.
 */
browser.storage.onChanged.addListener(async (changes, area) => {
	// Ensure the storage changes came from the Jira-RTL extension only
	if (area !== "sync") return;
	if (!changes.Jira_RTL_settings) return;
	
	const settings = await loadSettings();

	applySettings(settings);
});

console.log("Jira_RTL extension loaded");