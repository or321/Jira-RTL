import "./compatibility";
import { loadSettings } from "./settings";
import { setDirection, resetRTL } from "./rtl";
import { scanTargets } from "./scan-targets";

const observerConfig = {
	childList: true,
	subtree: true
};

const activeObservers = new Set();

function applyScanners(parent, scanners) {
	for (const scanner of scanners) {
		if (typeof scanner === 'string') {
			parent.querySelectorAll?.(scanner).forEach(setDirection);
		} else if (typeof scanner === 'function') {
			scanner().forEach(setDirection);
		}
	}
}

function createObserverCallback(scanners) {
	return function (mutationsList) {
		for (const mutation of mutationsList) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;

				applyScanners(node, scanners);
			}
		}
	};
}

function scan() {
	for (const { getTarget, scanners } of scanTargets) {
		const target = getTarget();
		if (!target) continue;

		const observer = new MutationObserver(createObserverCallback(scanners));
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

	document.querySelectorAll('[data-rtl-applied="true"]').forEach(resetRTL);
}

window.onload = (event) => {
	loadSettings((settings) => {
		if (settings.enabled) {
			console.log("JiraRTL - starting a new scan - page load");
			scan();
		}
	});
};

// Handle runtime messages
browser.runtime.onMessage.addListener((msg) => {
	if (msg.from !== "JiraRTL_popup") return;

	switch (msg.type) {
		case "JiraRTL_enable":
			console.log("JiraRTL - starting a new scan");
			scan();
			break;
		case "JiraRTL_disable":
			console.log("JiraRTL - starting a cleanup");
			cleanup();
			break;
	}
});

console.log("JiraRTL finished initializing");