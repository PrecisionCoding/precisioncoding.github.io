	
(function($) {
	var iPhone5Width = 320;
	var iPhone5Height = 568;
	
	var isMobile = $(window).width() <= iPhone5Height;
	var isIphone5Portrait = $(window).width() == iPhone5Width;
	var isIphone5Landscape = $(window).width() == iPhone5Height;
	
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