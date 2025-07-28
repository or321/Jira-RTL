//import "./compatibility";
import { loadSettings } from "./settings";
import { setDirection, resetRTL } from "./rtl";
import { scanTargets, editableInputTargets } from "./scan-targets";

const activeObservers = new Set();
const activeInputListeners = new Map();

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
	for (const { getTarget, scanners, detectTextTyping } of scanTargets) {
		const target = getTarget();
		if (!target) continue;

		const observer = new MutationObserver(createObserverCallback(scanners));

		const observerConfig = {
			subtree: true,
			childList: !detectTextTyping,
			characterData: !!detectTextTyping
		};

		observer.observe(target, observerConfig);

		activeObservers.add(observer);

		applyScanners(target, scanners);
	}

	// Attach input handlers
	for (const inputTarget of editableInputTargets) {
		document.querySelectorAll(inputTarget).forEach((inputEl) => {
			if (activeInputListeners.has(inputEl)) return; // already attached

			const inputHandler = (event) => {
				setDirection(event.target);
			};

			inputEl.addEventListener('input', inputHandler);
			activeInputListeners.set(inputEl, inputHandler);
		});

	}
}

function cleanup() {
	// Detach observers
	for (const observer of activeObservers) {
		observer.disconnect();
	}
	activeObservers.clear();

	// Detach input handlers
	for (const [el, handler] of activeInputListeners.entries()) {
		el.removeEventListener('input', handler);
	}
	activeInputListeners.clear();

	document.querySelectorAll('[data-rtl-applied="true"]').forEach(resetRTL);
}

window.onload = (event) => {
	loadSettings((settings) => {
		console.log("initial settings:", settings);
		if (settings.enabled) {
			console.log("JiraRTL - starting a new scan - page load");
			scan();
		}
	});
};

// Handle runtime messages
chrome.runtime.onMessage.addListener((msg) => {
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