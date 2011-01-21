/**
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Copyright (c) 2011 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 0.9 (beta) - Last updated: 2011.01.21
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 
 */

;(function(){
var	isIphone = (/iphone/gi).test(navigator.platform),
	isIpod = (/ipod/gi).test(navigator.platform),
	isIpad = (/ipad/gi).test(navigator.platform),
	hasHomescreen = 'standalone' in navigator && (isIphone || isIpad || isIpod),
	isStandalone = hasHomescreen && navigator.standalone,
	OSVersion = navigator.appVersion.match(/OS \d+_\d+/g),
	startY = startX = 0,
	expired = localStorage.getItem('_addToHome'),
	theInterval,
	closeTimeout,
	el,
	options = {
		animationIn: 'drop',		// drop || bubble || fade
		animationOut: 'fade',		// drop || bubble || fade
		startDelay: 2000,			// 2 seconds from page load before the balloon appears
		lifespan: 20000,			// 20 seconds before it is automatically destroyed
		bottomOffset: 14,			// Distance of the balloon from bottom
		expire: 0,					// Minutes to wait before showing the popup again (0 = always displayed)
		iterations:100
	};
	
	OSVersion = OSVersion ? OSVersion[0].replace(/[^\d_]/g,'').replace('_','.')*1 : 0;
	expired = expired == 'null' ? 0 : expired;

function ready () {
	document.removeEventListener('DOMContentLoaded', ready, false);

	var div = document.createElement('div'),
		close;
	div.id = 'addToHomeScreen';
	div.className = isIpad ? 'ipad' : 'iphone';
	div.style.cssText += 'position:absolute;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);';
	div.style.left = '-9999px';		// Hide from view at startup
	
	div.innerHTML = 'Install this web app on your ' + navigator.platform.split(' ')[0] + ': tap `<span class="' + (OSVersion >= 4.2 ? 'share' : 'plus') + '">+</span>` and then `<strong>Add to Home Screen</strong>`.<span class="arrow"></span><span class="close">×</span>';
	
	document.body.appendChild(div);
	el = div;
	close = el.querySelector('.close');
	if (close) {
		close.addEventListener('click', addToHomeClose, false);
	}
	
	if (options.expire) localStorage.setItem('_addToHome', new Date().getTime() + options.expire*60*1000);
}

function loaded () {
	window.removeEventListener('load', loaded, false);

	setTimeout(function () {
		var duration;
		
		startY = isIpad ? window.scrollY : window.innerHeight + window.scrollY;
		startX = isIpad ? window.scrollX : Math.round((window.innerWidth - el.offsetWidth)/2) + window.scrollX;

		el.style.top = isIpad ? startY + options.bottomOffset + 'px' : startY - el.offsetHeight - options.bottomOffset + 'px';
		el.style.left = isIpad ? startX + 208 - Math.round(el.offsetWidth/2) + 'px' : startX + 'px';

		switch (options.animationIn) {
			case 'drop':
				if (isIpad) {
					duration = '0.6s';
					el.style.webkitTransform = 'translate3d(0,' + -(window.scrollY + options.bottomOffset + el.offsetHeight) + 'px,0)';
				} else {
					duration = '0.9s';
					el.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
				}
				break;
			case 'bubble':
				if (isIpad) {
					duration = '0.6s';
					el.style.opacity = '0'
					el.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
				} else {
					duration = '0.6s';
					el.style.webkitTransform = 'translate3d(0,' + (el.offsetHeight + options.bottomOffset + 50) + 'px,0)';
				}
				break;
			default:
				duration = '1s';
				el.style.opacity = '0';
		}

		setTimeout(function () {
			el.style.webkitTransitionDuration = duration;
			el.style.opacity = '1';
			el.style.webkitTransform = 'translate3d(0,0,0)';
			el.addEventListener('webkitTransitionEnd', transitionEnd, false);
		}, 0);

		closeTimeout = setTimeout(addToHomeClose, options.lifespan);
	}, options.startDelay);
}

function transitionEnd () {
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
	el.style.webkitTransitionProperty = '-webkit-transform';
	el.style.webkitTransitionDuration = '0.2s';

	if (closeTimeout) {		// Standard loop
		clearInterval(theInterval);
		theInterval = setInterval(setPosition, options.iterations);
	} else {				// We are closing
		el.parentNode.removeChild(el);
	}
}

function setPosition () {
	var matrix = new WebKitCSSMatrix(window.getComputedStyle(el, null).webkitTransform),
		posY = isIpad ? window.scrollY - startY : window.scrollY + window.innerHeight - startY,
		posX = isIpad ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - el.offsetWidth)/2) - startX;

	if (posY == matrix.m42 && posX == matrix.m41) return;

	clearInterval(theInterval);
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
//	el.style.webkitTransitionDuration = '0';

	setTimeout(function () {
		el.addEventListener('webkitTransitionEnd', transitionEnd, false);
//		el.style.webkitTransitionDuration = '0.2s';
		el.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}, 0);
}

function addToHomeClose () {
	clearInterval(theInterval);
	clearTimeout(closeTimeout);
	closeTimeout = null;
	el.removeEventListener('webkitTransitionEnd', transitionEnd, false);
	
	var posY = isIpad ? window.scrollY - startY : window.scrollY + window.innerHeight - startY,
		posX = isIpad ? window.scrollX - startX : window.scrollX + Math.round((window.innerWidth - el.offsetWidth)/2) - startX,
		opacity = '1',
		duration = '0',
		close;

	close = el.querySelector('.close');
	if (close) {
		close.removeEventListener('click', addToHomeClose, false);
	}

	el.style.webkitTransitionProperty = '-webkit-transform,opacity';

	switch (options.animationOut) {
		case 'drop':
			if (isIpad) {
				duration = '0.4s';
				opacity = '0';
				posY = posY + 50;
			} else {
				duration = '0.6s';
				posY = posY + el.offsetHeight + options.bottomOffset + 50;
			}
			break;
		case 'bubble':
			if (isIpad) {
				duration = '0.8s';
				posY = posY - el.offsetHeight - options.bottomOffset - 50;
			} else {
				duration = '0.4s';
				opacity = '0';
				posY = posY - 50;
			}
			break;
		default:
			duration = '0.8s';
			opacity = '0';
	}

	el.addEventListener('webkitTransitionEnd', transitionEnd, false);
	el.style.opacity = opacity;
	el.style.webkitTransitionDuration = duration;
	el.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
}

/* Bootstrap */
if (window.addToHomeConfig) {
	for (i in window.addToHomeConfig) {
		options[i] = window.addToHomeConfig[i];
	}
}

/* Is it expired */
if (!options.expire || expired < new Date().getTime()) {
	expired = 0;
	localStorage.setItem('_addToHome', expired);
}

if (hasHomescreen && !expired) {
	document.addEventListener('DOMContentLoaded', ready, false);
	window.addEventListener('load', loaded, false);
}

/* Public function */
window.addToHomeClose = addToHomeClose;
})();