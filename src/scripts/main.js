import { loadSettings } from "./settings";
import { setDirection, removeRTL, JIRA_RTL_APPLIED_CLASS } from "./rtl";
import { rtlObserver } from "./rtlObserver"
import "../styles/rtl.css"
//import { observerRules, combinedSelector } from "./observerRules";

const activeObservers = new Set();

function injectRTLStylesheet() {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = chrome.runtime.getURL('assets/main.css');
	document.head.appendChild(link);
}

function applyScanners(parent, scanners) {
	for (const scanner of scanners) {
		if (typeof scanner === 'string') {
			parent.querySelectorAll?.(scanner).forEach(setDirection);
		} else if (typeof scanner === 'function') {
			scanner().forEach(setDirection);
		}
	}
}

function applyScannersToParent(node, scanners) {
	for (const scanner of scanners) {
		const el = node.closest(scanner);
		if (el) {
			setDirection(el);
		}
	}
}

function createObserverCallback(scanners) {
	return function (mutationsList) {
		for (const mutation of mutationsList) {
			//console.log("mutation:", mutation);

			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) {
					if (!(node instanceof HTMLElement)) continue;

					applyScanners(node, scanners);
				}
			}

			if (mutation.type === "characterData") {
				const node = mutation.target.parentNode;
				if (!(node instanceof HTMLElement)) continue;

				applyScannersToParent(node, scanners);
			}
		}
	};
}

function scan() {
	for (const { getTarget, scanners, detectTextTyping } of observerRules) {
		const target = getTarget();
		if (!target) continue;

		const observer = new MutationObserver(createObserverCallback(scanners));

		const observerConfig = {
			childList: true,
			subtree: true,
			characterData: !!detectTextTyping
		};

		observer.observe(target, observerConfig);

		activeObservers.add(observer);

		applyScanners(target, scanners);
	}
}

function cleanup() {
	for (const observer of activeObservers) {
		observer.disconnect();
	}
	activeObservers.clear();

	document.querySelectorAll(`.${JIRA_RTL_APPLIED_CLASS}`).forEach(removeRTL);
}

window.onload = (event) => {
	injectRTLStylesheet();

	loadSettings((settings) => {
		console.log("initial settings:", settings);
		if (settings.enabled) {
			console.log("JiraRTL - starting a new scan - page load");
			rtlObserver.initialize();
			//scan();
		}
	});
};

// Handle runtime messages
chrome.runtime.onMessage.addListener((msg) => {
	if (msg.from !== "JiraRTL_popup") return;

	switch (msg.type) {
		case "JiraRTL_enable":
			console.log("JiraRTL - starting a new scan");
			rtlObserver.initialize();
			break;
		case "JiraRTL_disable":
			console.log("JiraRTL - starting a cleanup");
			rtlObserver.cleanup();
			break;
	}
});

console.log("JiraRTL finished initializing");