var question_selected = false;

// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

window.oncontextmenu = function () {
	return false;
}
document.onkeydown = function (e) {
	if (window.event.keyCode == 123 || e.button == 2)
		return false;
}

$(window).load(function() {
//timer
	var timer = $('#timer'),
		min = timer.find('.min'),
		sek = timer.find('.sek'),
	    timer2 = $('#timer2'),
		min2 = timer2.find('.min'),
		sek2 = timer2.find('.sek'),
		s = 0, m = 3, time;

	function timerFunc() {
		if(s <= 10) {
			if(s == 0) {
				if(m == 0) {
					clearInterval(time);
					//
					bgReset();
					$('#summ-val').text(parseInt($('#qvalue').text()));
					$('#choice, #qpart').delay(500).fadeOut(function() {
						$('#summ').fadeIn();
						$('#form-count').val(parseInt($('#qvalue').text()));
					});

				} else {
					s = 60;
					s --;
					m --;
					min.text(m);
					sek.text(s);
					min2.text(m);
					sek2.text(s);
				}
			} else {
				s --;
			    sek.text('0' + s);
                            sek2.text('0' + s);
			}
		} else {
			s --;
		    sek.text(s);
                    sek2.text(s);
		}
	}

	function numb() {
		$('#jp_container_1 .jp-play').trigger('click');
		var nuic = 3;
		$('.numb__center').fadeIn(500);
		var nui = setInterval(function() {
			$('.numb__center').text(nuic);
			nuic --;
			if(nuic < 0) {
				clearInterval(nui);
				$('#numb').fadeOut(function() {
					$('#choice').fadeIn();
				});
				time = setInterval(timerFunc, 1000);
			}
		}, 800);
	}

	$('#pash').on('click', function() {
		$('#part-err').fadeIn();
	});

	$('#pashclose').on('click', function() {
		$('#part-err').fadeOut(600);
	});

	$('#start').on('click', function() {
		$('#part-first').fadeOut(function() {
			$('#numb').fadeIn();
			numb();
		});
	});

	//background reset

	function bgReset() {
		$('.background__overlay')
		.removeClass('background__overlay_100')
		.removeClass('background__overlay_200')
		.removeClass('background__overlay_400')
		.removeClass('background__overlay_600')
		.removeClass('background__overlay_800');
	}

	//choice
		var citem = $('.choice__item'),
			qpart = $('#qpart'),
			cself;

		citem.on('click', function(e) {
			if (question_selected) {
				e.preventDefault();
				return false;
			}
			cself = $(this);
			if(!$(this).hasClass('opened')) {
				question_selected = true;
				cself.addClass('opened');
				$('#choice').fadeOut(function() {
					$('.background__overlay').addClass(cself.attr('data-bg'));
					qpart.fadeIn();

					$('#' + cself.attr('href')).fadeIn();
					$(window).trigger('resize');
				});
			}

			e.preventDefault();
		});

	//buttons

	var pinput = $('.pbutton__input'), self,
	    qvalue = $('#qvalue');
    qvalue2 = $('#qvalue2');

		pinput.each(function() {
			$(this).knob();
		});

	$('.pbutton').on('click', function() {
		var self = $(this);
		if(!self.hasClass('disabl')) {
			question_selected = false;
			self.parent().parent().parent().find('.pbutton').each(function(){
				$(this).addClass('disabl');
			});
			self.find('.pbutton__text').hide();
			self.find('.pbutton__border').addClass('animated');
			self.find('.pbutton__box').delay(300).animate({opacity: 1});
			$({animatedVal: 0}).animate({animatedVal: 100}, {
				duration: 1500,
				easing: "swing",
				step: function() {
					self.find(".pbutton__input").val(Math.ceil(this.animatedVal)).trigger("change");
				},
				complete: function() {
				    qvalue.text(parseInt(qvalue.text()) + parseInt(self.attr('data-value')));
                                    qvalue2.text(parseInt(qvalue2.text()) + parseInt(self.attr('data-value')));
					if(0 && parseInt(self.attr('data-value')) == 0) {
						$('#jp_container_2 .jp-play').trigger('click');
					} else {
						$('#jp_container_3 .jp-play').trigger('click');
					}
					self.find('.pbutton__box').css({'opacity': 0});
					self.find('.pbutton__border').addClass('hover').removeClass('animated');
					self.find('.pbutton__sucess').fadeIn();


					//
					if((s == 0 && m == 0) || $('.choice__item').not('.opened').length == 0) {
						clearInterval(time);
						//
						bgReset();
						$('#summ-val').text(parseInt($('#qvalue').text()));
						$('#choice, #qpart').delay(500).fadeOut(function() {
							$('#summ').fadeIn();
							$('#form-count').val(parseInt($('#qvalue').text()));
						});
					} else {
						//next question
						self.parents('.part__quest').delay(500).fadeOut(function() {
							if($(this).next().length != 0) {
								$(this).next().fadeIn();
							} else {
								bgReset();
								qpart.fadeOut(function() {
									$('.part__quest, .part__item').attr('style', '');
									$('#choice').fadeIn();
								});
							}
							$(window).trigger('resize');
						});
					}
				}
			});
		}
	});


	$('#form-show').on('click', function() {
		$('#summ').fadeOut(function() {
			$('#form').fadeIn();
		});
	});
	//
	$('.main-wnd__height').css({'min-height': $('.main-wnd__inner').height(), 'height': $(window).height() - $('.main-wnd__start').height()});
	$(window).resize(function() {
		$('.main-wnd__height').css({'min-height': $('.main-wnd__inner').height(), 'height': $(window).height() - $('.main-wnd__start').height()});
	});
	//
	$('.part__quest').each(function() {
		$(this).find('.question__q').css('min-height', $(window).height() - $(this).find('.question__buttons').height() - $(this).find('.question__top').height());
	});
	$(window).resize(function() {
		$('.part__quest').each(function() {
			$(this).find('.question__q').css('min-height', $(window).height() - $(this).find('.question__buttons').height() - $(this).find('.question__top').height() - 218);
		});
	});

	//
	setTimeout(function() {
		$('.loading').fadeOut();
	}, 1000);

});

function submit_form(form) {
	var player_nickname = form.elements['nickname'].value;
	var player_record = form.elements['record'].value;

	$.post('/score', {"name": player_nickname, "score": player_record}, function() {
		window.location = '/';
	});
}

function reload_records(data) {
	if (data === undefined) {
		$.get('/score', function(data) {
			reload_records(data);
		});
		return;
	}

	for (var i = 0; i < 5; i++) {
		if (data.length > i) {
			document.getElementById('name-' + i).innerHTML = data[i].Name.replace('<', '&lt;').replace('>', '&gt;');
			document.getElementById('record-' + i).innerHTML = data[i].Score;
		} else {
			document.getElementById('name-' + i).innerHTML = '';
			document.getElementById('record-' + i).innerHTML = '';
		}
	}
}
