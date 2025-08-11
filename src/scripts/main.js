import { loadSettings } from "./settings";
import { rtlObserver } from "./rtlObserver"
import "../styles/rtl.css"

function injectRTLStylesheet() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = chrome.runtime.getURL('assets/jira-rtl.css');
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

runWhenReady(() => {
	injectRTLStylesheet();
	loadSettings((settings) => {
		if (settings.enabled) {
			console.log("Jira-RTL - starting initial scan");
			rtlObserver.initialize();
		}
	});
});

// Handle runtime messages
chrome.runtime.onMessage.addListener((msg) => {
	if (msg.from !== "Jira_RTL_popup") return;

	switch (msg.type) {
		case "Jira_RTL_enable":
			console.log("Jira-RTL enabled, starting a new scan");
			rtlObserver.initialize();
			break;
		case "Jira_RTL_disable":
			console.log("Jira-RTL disabled, starting cleanup");
			rtlObserver.cleanup();
			break;
	}
});

console.log("Jira-RTL extension loaded");