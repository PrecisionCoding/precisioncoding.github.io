var styleSwitcher = document.getElementsByName("newsView");
var storedClassName = localStorage.getItem("bodyClassName");

var addEvent = function(type, to, fn) {
	if (to.addEventListener) {
		to.addEventListener(type, fn, false);
	} else if (to.attachEvent) {
		to.attachEvent('on' + type, fn);
	} else {
		to[type] = fn;
	}
}

function cssLoaded(href) {
	var cssFound = false;

	if (document.styleSheets != null) {
		for (var i = 0; i < document.styleSheets.length; i++) {
			var sheet = document.styleSheets[i];
			
			if (sheet['href'].indexOf(href) >= 0 ){
				var rules = sheet.cssRules || sheet.rules;
				if (rules != null && rules.length > 0) {
					cssFound = true;
				}
			}
		}
	}
	return cssFound;
}

if (!cssLoaded('//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css')) {
	local_bootstrap = document.createElement('link');
	local_bootstrap.setAttribute("rel", "stylesheet");
	local_bootstrap.setAttribute("href", "css/helpers/font-awesome/4.0.1/css/font-awesome.min.css");
	document.getElementsByTagName("head")[0].appendChild(local_bootstrap);
}



var trigger = function(action, el) {
	if (document.createEvent) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent(action, true, false);
		el.dispatchEvent(event);
	} else {
		el.fireEvent('on' + action);
	}
}



function switchStyles() {
	var styleSwitch = "";
	for (var i = 0; i < styleSwitcher.length; i++) {
		if (styleSwitcher[i].checked == true) {
			styleSwitch = styleSwitcher[i].value;
		}
	}

	console.log(styleSwitch);

	if (localStorage.length && localStorage.key("bodyClassName")) {
	    if (document.body.classList.contains(localStorage.getItem("bodyClassName"))) {
	        document.body.classList.remove(localStorage.getItem("bodyClassName"));
	    }
	    localStorage.removeItem('bodyClassName');
	}

	document.body.classList.add(styleSwitch);
	localStorage.setItem("bodyClassName", styleSwitch);
}

if (storedClassName) {
	console.log("stored");
	for (var i = 0; i < styleSwitcher.length; i++) {
		if (styleSwitcher[i].value === storedClassName) {
			styleSwitcher[i].checked = true;
			trigger("change", styleSwitcher);
		}
	}
}

addEvent(styleSwitcher, 'click', switchStyles);

var menuBarToggler = document.querySelector("#menubar-toggle" );
var menuBar = document.querySelector('[role="menubar"]');

var navBarToggler = document.querySelector("#navbar-toggle" );
var navBar = document.querySelector('[role="navigation"]');

  var ico = document.createElement("span");
  menuBarToggler.appendChild(ico);
  navBarToggler.appendChild(ico);

addEvent('load', document, function(){
	console.log("loaded");
});

addEvent( "click", menuBarToggler, function() {
  this.classList.toggle( "active" );
  menuBar.classList.toggle('slideOut');
});

addEvent( "click", navBarToggler, function() {
  this.classList.toggle( "active" );
  navBar.classList.toggle('slideOut');
});

(function ($) {
	$(window).resize(function() {
		if(windowWidth != $(window).width()){
			location.reload();
			return;
		}
	});

	var windowWidth = $(window).width();
	var mediabreaks = [320, 480, 568, 768, 960, 1174];

	//for (var m = 0; m < mediabreaks.length; m++) {
	//    if (windowWidth >= mediabreaks[m]) {
	var sliderWidth = $('[role="slider"] div:first').width();
	$('.slider-nav').width(((windowWidth - 4) - sliderWidth) / 2 );
	//    }
	//}
	
	var iPhone5Width = 320;
	var iPhone5Height = 568;
	var isMobile = windowWidth <= iPhone5Height;
	var isIphone5Portrait = windowWidth == iPhone5Width;
	var isIphone5Landscape = windowWidth == iPhone5Height;
	
	var locale = window.location.host.split('.')[0];

	var mainNavigation;
	var mainSidebar;
	var orientation;
	
	var calculateEqualHeights = function(elem){
		var maxHeight = -1;
		$(elem).each( function(){
			maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
		}).each( function(){
			$(this).height( maxHeight );
		});
	}	

	var updateOrientation = function () {
		// rewrite the function depending on what's supported
		if (supportsOrientation) {
			updateOrientation = function () {
				orientation = window.orientation;

				switch (orientation) {
				case 90:
				case  - 90:
					orientation = 'landscape';
					break;
				default:
					orientation = 'portrait';
				}
				//$('aside[role="tabpanel"]').css('left', $(window).width() + 'px');
			}
		} else {
			updateOrientation = function () {
				// landscape when width is biggest, otherwise portrait
				orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
				//$('aside[role="tabpanel"]').css('left', $(window).width() + 'px');
			}
		}

		updateOrientation();
	}
	
	var scrollFixedMenu = function(menu){
		$(window).scroll(function() {
			if ($(menu).height() >= $(window).height()) {    // offset?
			  $(menu).css({'position':'fixed','overflow':'scroll'});
			} else {
			  $(menu).css({'position':'absolute','bottom':'0'});
			}
		});
	}	
	
	if (isMobile) {
		$('#s-slideshowpro-test .page-wrapper').css({outline: '1px dotted green' });
		
		updateOrientation();
		var supportsOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object');
		if (supportsOrientation) {
			window.addEventListener('orientationchange', updateOrientation, false);
		}
		// create hook for body
		$('body').addClass('isMobile');
		// Clone our navigation
		mainNavigation = $('nav[role="navigation"]').clone();
		// remove the superfish menu class
		$('nav[role="navigation"]').children('ul').removeClass('sf-menu').addClass('mobileMenu');
		//add it back to the page
		$('nav[role="navigation"]').prependTo('body').show();

		if ($('aside[role="tabpanel"]').length > 0) {
			$('#asideMenuIcon').show();
			// Clone the sidebar
			mainSidebar = $('aside[role="tabpanel"]').clone();
			//add the mainsidebar back to the page
			$('aside[role="tabpanel"]').prependTo('body').show();

			$('aside[role="tabpanel"]').css('left', $(window).width() + 'px');
		}

		var menuStatus = false;
		var asideStatus = false;
		var navMargin = "280px";
		var sideMargin = -Math.abs(280) + "px";

		var clonedSides = function (trigger, sidebar, movement, flag) {
			$('[role="banner"]').children('figure').on('click', trigger, function (n) {
				n.preventDefault();
				if (flag != true) {
					$('.page-wrapper').animate({ marginLeft : movement, }, 300, function () { 
						$(sidebar).animate({ marginLeft : movement, }, 300, function () { flag = true });
					});
				} else {
					$(sidebar).animate({ marginLeft : 0, }, 300, function () {
						$('.page-wrapper').animate({ marginLeft : 0, }, 300, function () { flag = false });						
					});
				}
				
				if ($('a#scroll-to-top').is('visible')) {
					console.log("scroll visible");
					$(this).trigger('click');
				}
			});
		}

		clonedSides('#navMenuIcon', 'nav[role="navigation"]', navMargin, menuStatus);
		clonedSides('#asideMenuIcon', 'aside[role="tabpanel"]', sideMargin, asideStatus);
		
		//scrollFixedMenu('nav[role="navigation"]');

	} //-END isMobile
	
})(jQuery);