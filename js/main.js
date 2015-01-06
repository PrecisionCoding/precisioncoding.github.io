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

/*var menuBarToggler = document.createElement("button");
menuBarToggler.setAttribute('id', 'navbar-toggle');
menuBarToggler.setAttribute('class', 'navbar toggler');
menuBarToggler.setAttribute('title', 'View Site Navigation');
menuBarToggler.setAttribute('role', 'button');
menuBarToggler.setAttribute('aria-label', 'Toggle Navigation Menu');

var menuBar = document.querySelector('[role="menubar"]');

var navBarToggler = document.querySelector("#navbar-toggle" );
var navBar = document.querySelector('[role="navigation"]');

menuBarToggler.appendChild(document.createElement("span"));
navBarToggler.appendChild(document.createElement("span"));

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
});*/

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
		
		updateOrientation();
		var supportsOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object');
		if (supportsOrientation) {
			window.addEventListener('orientationchange', updateOrientation, false);
		}
		// create hook for body
		$('body').addClass('isMobile');

		//<button id="navbar-toggle" class="navbar toggler" title="View Site Navigation" role="button" aria-label="Toggle Navigation Menu"></button>
      	//<button id="menubar-toggle" class="menubar toggler" title="Browse Connectivity" role="button" aria-label="Toggle Connectivity Menu"></button>

		var $menuBarToggler = $('<button>', {
			'id': 'menubar-toggle',
			'class': 'menubar toggler',
			'title': 'Browse Connectivity',
			'role': 'button',
			'aria-label': 'Toggle Connectivity Menu',
			click: function() {
				$( this ).toggleClass( "active" );
				$('[role="menubar"]').toggleClass("slideOut");
			}
		}).prepend('<span></span>').prependTo('[role="banner"]');

		var $navBarToggler = $('<button>', {
			'id': 'navbar-toggle',
			'class': 'navbar toggler',
			'title': 'View Site Navigation',
			'role': 'button',
			'aria-label': 'Toggle Navigation Menu',
			click: function() {
				$( this ).toggleClass( "active" );
				$('[role="navigation"]').toggleClass("slideOut");
			}
		}).prepend('<span></span>').prependTo('[role="banner"]');

		if ($('[role="search"]').length > 0 ){
			var searchbar = $('[role="search"]').clone();
			$('[role="search"]').appendTo('main');
		}

		if ($('aside[role="menubar"]').length > 0) {
			//Show menubar navigation button
			$('#menubar-toggle').show();
			// Clone the sidebar
			mainSidebar = $('aside[role="menubar"]').clone();
			//add the mainsidebar back to the page
			$('aside[role="menubar"]').prependTo('body').show();
			//position on the right edge of the screen
			$('aside[role="menubar"]').css({'left': ($(window).width() - 1) + 'px', 'height': $(document).height() + 'px'});
		}

		if ($('aside[role="navigation"]').length > 0){
			//Show navigation toggle button
			$('#menubar-toggle').show();
			// Clone our navigation
			mainNavigation = $('aside[role="navigation"]').clone();
			// remove the superfish menu class
			$('aside[role="navigation"]').children('ul').removeClass('sf-menu').addClass('mobileMenu');
			//add it back to the page
			$('aside[role="navigation"]').prependTo('body').show();
			//set the height to the document
			$('aside[role="navigation"]').css('height', $(document).height() + 'px');

		}

		var menuWidth = 280;
		var menuStatus = false;
		var asideStatus = false;
		var navMargin = Math.abs(menuWidth) + "px";
		var sideMargin = -Math.abs(menuWidth) + "px";

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

		clonedSides('#navbar-toggle', 'aside[role="navigation"]', navMargin, menuStatus);
		clonedSides('#menubar-toggle', 'aside[role="menubar"]', sideMargin, asideStatus);
		
		//scrollFixedMenu('nav[role="navigation"]');

	} //-END isMobile
	
})(jQuery);