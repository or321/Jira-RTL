// Copied from https://www.npmjs.com/package/@unicode/unicode-16.0.0/Bidi_Class/Right_To_Left/regex.js
const RTL_REGEX = /[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05EF-\u05F4\u07C0-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC57-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD3F\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE50-\uDE58\uDE60-\uDE9F\uDEC0-\uDEE4\uDEEB-\uDEF6\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDF99-\uDF9C\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDCFF\uDD4A-\uDD65\uDD6F-\uDD85\uDD8E\uDD8F\uDE80-\uDEA9\uDEAD\uDEB0\uDEB1\uDF00-\uDF27\uDF70-\uDF81\uDF86-\uDF89\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59\uDD5E\uDD5F]/;

function isRTL(text) {
	return RTL_REGEX.test(text);
}

function applyRTL(el) {
	el.style.direction = "rtl";
	el.style.textAlign = "right";
	el.dataset.rtlApplied = "true";
}

function resetRTL(el) {
	el.style.direction = "";
	el.style.textAlign = "";
	el.dataset.rtlApplied = "";
}

export function setDirection(el) {
	if (el && !el.dataset.rtlApplied && isRTL(el.innerText)) {
		applyRTL(el);
	}
	else if (el && el.dataset.rtlApplied && !isRTL(el.innerText)) {
		resetRTL(el)
	}
}