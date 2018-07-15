/* 
	* Copyright nickpettican
	* Code licensed under the Apache License v2.0.
	* For details, see http://www.apache.org/licenses/LICENSE-2.0. 
*/

$(window).scroll(toggleNavCollapse);
// $(window).scroll(mcrParallax);
$(window).scroll(sherlockParallax);
$(window).scroll(berlinParallax);
$(window).scroll(nowParallax);
$(window).scroll(popupWhenBottom);

$(document).ready(toggleNavCollapse);
$(document).ready(collapseContent);
$(document).ready(collapseList);
$(document).ready(navDropDown);
$(document).ready(collapseFeedback);
$(document).ready(buttonFeedback);
$(document).ready(closeFeedback);
$(document).ready(openContact);
$(document).ready(closeContact);
$(document).ready(scrollContact);

// NAVBAR

$(document).ready(function () {
	$(".navbar-toggle").on("click", function () {
		$(this).toggleClass("active");
		if (!pagePositionScrolled()) {
			$(".navbar-fixed-top").toggleClass("navbar-transform");
		}
		if ($("#burger").hasClass("active")) {
			toggleColour("black");
		} else {
			$(".navbar-default .navbar-brand").css("color", returnColour(pagePositionScrolled()));
			$(".navbar-toggle .icon-bar:nth-of-type(1)").css("background-color", returnColour(pagePositionScrolled()));
			$(".navbar-toggle .icon-bar:nth-of-type(3)").css("background-color", returnColour(pagePositionScrolled()));
			//toggleColour(returnColour(pagePositionScrolled()));
		} 
		window.setTimeout(toggleBurger, 500);
	});
});

$(document).ready(function () {
	$(document).on("click", function (event) {
		var clickover = $(event.target);
		if ($(".navbar-collapse").hasClass("collapse in") && !clickover.hasClass("navbar-toggle") && !clickover.hasClass("icon-bar")){
			if ($(".dropdown").hasClass("open")) {
				$(".shows-more-dropdown").click();
			}
			$("#burger").click();
		}
		if ($(".dropdown").hasClass("open")) {
			//console.log('hi')
			event.stopPropagation()
			//$(".shows-more-dropdown").click();
		}
	});
});

function navDropDown() {
	$(".dropdown").on("show.bs.dropdown", function (event) {
		$(this).find('.dropdown-menu').first().stop(true, true).slideDown();
		$(".shows-more-dropdown").text($(".shows-more-dropdown").text());
		$(".shows-more-dropdown").append($("<i class='fa fa-angle-up'></i>"));
		$(".shows-more-dropdown").attr("aria-expanded", "true");
	});
	$(".dropdown").on("hide.bs.dropdown", function (event) {
		event.preventDefault();
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp(300, function () {
			$(this).parent().removeClass('open');
		});
		$(".shows-more-dropdown").text($(".shows-more-dropdown").text());
		$(".shows-more-dropdown").append($("<i class='fa fa-angle-down'></i>"));
		$(".shows-more-dropdown").attr("aria-expanded", "false");
	});
}

function pagePositionScrolled() {
	if ($(".navbar").offset().top > 100) { return true} else { return false}
}

function toggleNavCollapse() {
	if (pagePositionScrolled() &! $("#burger").hasClass("active")) {
		$(".navbar-fixed-top").removeClass("navbar-transform");
		toggleColour(returnColour(pagePositionScrolled()));
	} else if (!$("#burger").hasClass("active")){
		$(".navbar-fixed-top").addClass("navbar-transform");
		toggleColour(returnColour(pagePositionScrolled()));
	}
}

function returnColour(requirement) {
	if (requirement) { return "black"} else { return "white"}
}

function toggleColour(colour) {
	$(".navbar-default .navbar-nav li a").css("color", colour);
	$(".navbar-nav .dropdown-menu li a").css("color", "black")
	$(".navbar-default .navbar-brand").css("color", colour);
	$(".navbar-toggle .icon-bar").css("background-color", colour);
	$(".navbar-toggle.active .icon-bar").css({"background-color": colour})
}

function toggleBurger() {
	colour = returnColour(pagePositionScrolled())

	if ($("#burger").hasClass("active")){
		$(".navbar-toggle.active .icon-bar:nth-of-type(1)").css({"top": "6px", "transform": "rotate(45deg)"});
		$(".navbar-toggle.active .icon-bar:nth-of-type(3)").css({"top": "-6px", "transform": "rotate(-45deg)"});
		$(".navbar-toggle.active .icon-bar:nth-of-type(2)").css({"background-color": "transparent"});
	} else {
		$(".navbar-toggle .icon-bar:nth-of-type(1)").css({"top": "", "transform": ""});
		$(".navbar-toggle .icon-bar:nth-of-type(3)").css({"top": "", "transform": ""});
		toggleColour(returnColour(pagePositionScrolled()));
	}
}

// POPUP
var cue = false,
	oldX = 0,
	oldY = 0,
	posCount = 0,
	feedbackDone = false,
	bottomReached = false,
	sneakDone = false;

// cheeky feedback exit CTA
$(document).on("mousemove", function(i) {
	if (!sneakDone && !feedbackDone) {
		if (i.pageX < $(window).width() * 0.25) {
			var x = i.pageX,
				y = i.pageY - $(window).scrollTop();
			if (!cue) {
				oldX = x;
				oldY = y;
				cue = true;
			} else {
				difX = x - oldX;
				difY = y - oldY;
				oldX = x;
				oldY = y;
				if (difX <= 0 && difY <= 0) {
					posCount += 1
					if (y < 1 && posCount > 10) {
						$("#feedback h2 strong").text("Before you leave... leave some feedback")
						openFeedback();
					}
				} else {
					posCount = 0
				}
			}
		}
	}
});

function popupWhenBottom() {
	var bottom = Math.floor($("body").height() - $("footer").height());
	if (!bottomReached && !feedbackDone && !sneakDone && !$("#contact").hasClass("show-popup")){
		if (($(this).scrollTop() + $(this).height()) >= bottom) {
			bottomReached = true;
			ga('send', 'event', 'PageRead', 'read', 'Bottom Reached');
		}
	}
	// console.log($(this).scrollTop() + $(this).height(), bottom);
	if (bottomReached && ($(this).scrollTop() + $(this).height()) < (bottom - 140) && !$("#contact").hasClass("show-popup")) {
		openFeedback();
	}
}

// FEEDBACK POPUP
function buttonFeedback() {
	$("#willing-feedback").on("click", function (event) {
		event.preventDefault();
		if (!feedbackDone) {
			openFeedback();
		}
	});
}

function openFeedback() {
	if (!$("#contact").hasClass("show-popup")) {
		$("#feedback").switchClass("hide-popup", "show-popup", 100);
		$("#feedback").fadeIn();
		sneakDone = true;
	}
}

function collapseFeedback() {
	$("#feedback .btn-bad").on("click", function (event) {
		var feedbackButtons = $("#feedback-ask");
		if (feedbackButtons.hasClass("hide-feedback")) {
			feedbackButtons.switchClass("hide-feedback", "show-feedback", 400);
		}
	});
}

function removeFeedbackSection() {
	$("#feedback").fadeOut(400, function(){ $(this).remove();});
	feedbackDone = true;
}

function closeFeedback() {
	$(".close-feedback").on("click", function (event) {
		event.preventDefault();
		bottomReached = false;
		$("#feedback").fadeOut();
	});
	$("#feedback .btn-feedback").on("click", function (event) {
		$("#feedback .feedback-contents").slideUp(600, function(){ $(this).remove();});
		$("#feedback .popup-inner").append('<div class="row text-center" style="margin-top: 2em;"><h2><strong>Thank you for the feedback!</strong></h2></div>');
		window.setTimeout(removeFeedbackSection, 1500);
	});
	$("#feedback .btn-good").on("click", function (event) {
		console.log('Thank you!');
		if ($("#feedback-ask").hasClass("show-feedback")){
			var speed = 600
		} else {
			$("#feedback-ask").remove();
			var speed = 400
		}
		$("#feedback .feedback-contents").slideUp(speed, function(){ $(this).remove();});
		$("#feedback .popup-inner").append('<div class="row text-center" style="margin-top: 2em;"><h2><strong>Thank you for the feedback!</strong></h2></div>');
		window.setTimeout(removeFeedbackSection, 1500);
	});
}

// CONTACT POPUP
function openContact() {
	$(".btn-cta").on("click", function (event) {
		// event.preventDefault();
		$("#contact").switchClass("hide-popup", "show-popup", 100);
		$("#contact").fadeIn();
	});
	$(".contact-button").on("click", function (event) {
		event.preventDefault();
		$("#contact").switchClass("hide-popup", "show-popup", 100);
		$("#contact").fadeIn();
	});
}

function closeContact() {
	$(".close-contact").on("click", function (event) {
		event.preventDefault();
		$("#contact").fadeOut();
		$("#contact").switchClass("show-popup", "hide-popup");
		$("body").removeAttr("style");
		$("#contact").css("overflow-y", "hidden")
	});
	$("#contact-form").on("submit", function () {
		ga('send', 'event', 'Customer', 'click', 'Email Sent');
		$("#contact").fadeOut();
		$("#contact").switchClass("show-popup", "hide-popup");
		$("body").removeAttr("style");
		$("#contact").css("overflow-y", "hidden")
	});
}

function scrollContact() {
	$("input, textarea").focus(function() {
		$("body").css("overflow-y", "hidden");
		$("#contact").css("overflow-y", "scroll");
		$("#contact-wrapper").switchClass("popup-wrapper-normal", "popup-wrapper-focus");
	});
}

// COLLAPSE CONTENT
function collapseContent() {
	$(".show-more .reveals-more").on("click", function (event) {
		event.preventDefault();
		var content = $(this).parent().prevAll("dd").first();
		var anchor = $(this).text().toLowerCase().trim();
		var possibleList = $(this).parent().prevAll("ul").first();
		if (possibleList.hasClass("show-list")) {
			content.find("a").click();
		}
		if (anchor === "see more") {
			anchor = "See less "
			var arrow = "up"
			content.switchClass("hide-content", "show-content", 400);
		} else {
			anchor = "See more "
			var arrow = "down"
			content.switchClass("show-content", "hide-content", 400);
		}

		$(this).text(anchor);
		$(this).append($("<i class='fa fa-angle-" + arrow + "'></i>"));
	})
}

function collapseList() {
	$(".show-more-list .reveals-more").on("click", function (event) {
		event.preventDefault();
		var list = $(this).parent().next("ul");
		var anchor = $(this).text();
		if (list.hasClass("hide-list")) {
			list.switchClass("hide-list", "show-list", 400);
			var arrow = "up"
		} else {
			list.switchClass("show-list", "hide-list", 400);
			var arrow = "down"
		}

		$(this).text(anchor);
		$(this).append($("<i class='fa fa-angle-" + arrow + "'></i>"));
	});
}

// PAGE SCROLL ANIMATION
$("a.page-scroll").click(function() {
	var a = $(this);
	$("html, body").animate({
		scrollTop: $(a.attr("href")).offset().top
	}, 1200);
});

// PARALLAX
function mcrParallax() {
	var distScroll = $(this).scrollTop();
	if (distScroll < 850) {
		// only if in sight
		var times = [18, 6, 10, 16, 40];
		if ($(window).width() > 768) {
			
			var times = times.map( function(value) { 
			    return value + 4;
			} );
			times[0] += 10
		}
		if (distScroll > 100) {
			red = Math.round(15 + (((distScroll-100)/500)*224));
			green = Math.round(42 + (((distScroll-100)/500)*174));
			blue = Math.round(85 + (((distScroll-100)/500)*38));
			if (red < 239 && green < 216 && blue < 123) {
				$(".header-bg-index").css({
					"background": "rgb("+ red +", "+ green +", "+ blue +")"
				});
			}
		} else {
			$(".header-bg-index").css({
				"background": "rgb(15, 42, 85)"
			});
		}
		$(".mcr-sun").css({
			"transform": "translate(0px, -" + distScroll / times[0] + "%)"
		});
		$(".city-clouds").css({
			"transform": "translate(0px, " + distScroll / times[1] + "%)"
		});
		$(".mcr-mountains").css({
			"transform": "translate(0px, " + distScroll / times[2] + "%)"
		});
		$(".mcr-back").css({
			"transform": "translate(0px, " + distScroll / times[3] + "%)"
		});
		$(".mcr-front").css({
			"transform": "translate(0px, " + distScroll / times[4] + "%)"
		});
	}
}

function berlinParallax() {
	var distScroll = $(this).scrollTop();
	if (distScroll < 850) {
		// only if in sight
		var times = [30, 10, 10, 20, 500];
		if ($(window).width() > 768) {
			
			var times = times.map( function(value) { 
			    return value + 4;
			} );
			times[0] += 10
		}
		
		$(".berlin-moon").css({
			"transform": "translate(0px, -" + distScroll / times[0] + "%)"
		});
		$(".city-clouds").css({
			"transform": "translate(0px, " + distScroll / times[1] + "%)"
		});
		$(".berlin-back").css({
			"transform": "translate(0px, " + distScroll / times[2] + "%)"
		});
		$(".berlin-mid").css({
			"transform": "translate(0px, " + distScroll / times[3] + "%)"
		});
		$(".berlin-front").css({
			"transform": "translate(0px, " + distScroll / times[4] + "%)"
		});
	}
}

function sherlockParallax() {
	if (window.location.href.indexOf("SEO-sherlock") > -1) {
		var distScroll = $(this).scrollTop();
		if (distScroll < 850) {
			var times = [7, 9, 11, 9, 15, 50];
			if ($(window).width() > 1680) {
				var times = times.map( function(value) { 
				    return value + 5; 
				} );
			}
			$(".sherlock-cloud-1").css({
				"transform": "translate(0px, " + distScroll / times[0] + "%)"
			});
			$(".sherlock-cloud-2").css({
				"transform": "translate(0px, " + distScroll / times[1] + "%)"
			});
			$(".sherlock-cloud-3").css({
				"transform": "translate(0px, " + distScroll / times[2] + "%)"
			});
			$(".sherlock-stars").css({
				"transform": "translate(0px, " + distScroll / times[3] + "%)"
			});
			$(".sherlock-moon").css({
				"transform": "translate(0px, " + distScroll / times[4] + "%)"
			});
			$(".sherlock-profile").css({
				"transform": "translate(0px, " + distScroll / times[5] + "%)"
			});
		}
	}
}

function nowParallax() {
	if (window.location.href.indexOf("now") > -1) {
		var distScroll = $(this).scrollTop();
		if (distScroll < 850) {
			var times = [8, 10, 12, 50];
			$(".now-cloud-1").css({
				"transform": "translate(0px, " + distScroll / times[0] + "%)"
			});
			$(".now-cloud-2").css({
				"transform": "translate(0px, " + distScroll / times[1] + "%)"
			});
			$(".now-objects").css({
				"transform": "translate(0px, " + distScroll / times[2] + "%)"
			});
			$(".now-laptop").css({
				"transform": "translate(0px, -" + distScroll / times[3] + "%)"
			});
		}
	}
}
