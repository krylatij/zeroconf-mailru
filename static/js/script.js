var question_selected = false;
var config = null;


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
};
document.onkeydown = function (e) {
	if (window.event.keyCode == 123 || e.button == 2)
		return false;
};

$(window).load(function() {
    //timer
	var	s, m, time,
		mins = $('#timer > .min,#timer2 > .min'),
		secs = $('#timer > .sec,#timer2 > .sec');

	function timerFunc() {
		if(s == 0 && m == 0){
			clearInterval(time);
			//
			bgReset();
			$('#summ-val').text(parseInt($('#qvalue').text()));
			$('#choice, #qpart').delay(500).fadeOut(function() {
				$('#summ').fadeIn();
				$('#form-count').val(parseInt($('#qvalue').text()));
			});
		}
		if (s == 0){
			s = 60;
			if (m > 0)
				m --;
		}
		s --;
		mins.text(m);
		secs.text(s < 10 ? '0' + s : s);
	}

	function numb() {
		$('#jp_container_1').find('.jp-play').trigger('click');
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

	var pinput = $('.pbutton__input'),
	    qvalues = $('#qvalue,#qvalue2');

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
					var value = parseInt(self.attr('data-value'));
				    qvalues.text(parseInt(qvalues.text()) + value);

					if(0 && parseInt(self.attr('data-value')) == 0) {
						$('#jp_container_2').find('.jp-play').trigger('click');
					} else {
						$('#jp_container_3').find('.jp-play').trigger('click');
					}
					self.find('.pbutton__box').css({'opacity': 0});
					self.find('.pbutton__border').addClass('hover').removeClass('animated');

					var answerBlock = self.find('.pbutton__sucess');
					answerBlock.fadeIn();

					if(config.ShowRightAnswer){
						if(value > 0){
							answerBlock.addClass('pbutton__sucess_true');
						}
						else{
							answerBlock.addClass('pbutton__sucess_false');

							answerBlock.closest('.question__buttons').find('div[data-value]')
								.filter('[data-value!=0]')
								.addClass('pbutton__sucess_true');
						}
					}

					if((s == 0 && m == 0) || $('.choice__item').not('.opened').length == 0) {
						clearInterval(time);
						//
						bgReset();
						$('#summ-val').text(parseInt($('#qvalue').text()));
						$('#choice, #qpart').delay(config.ShowRightAnswerDelayMilliseconds).fadeOut(function() {
							$('#summ').fadeIn();
							$('#form-count').val(parseInt($('#qvalue').text()));
						});
					} else {
						//next question
						self.parents('.part__quest').delay(config.ShowRightAnswerDelayMilliseconds).fadeOut(function() {
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

	function initTime(minutes, seconds){
		m = minutes;
		s = seconds;
		mins.text(minutes);
		secs.text(seconds);

		var timeToDisplay = minutes + ' ' + units(minutes, {nom: 'минута', gen: 'минуты', plu: 'минут'});
		if (seconds > 0)
			timeToDisplay += ' ' + seconds + ' ' + units(seconds, {nom: 'секунда', gen: 'секунды', plu: 'секунд'});

		$('#time_to_play').text(timeToDisplay);
	};

	$.when($.getJSON('/config', function (data){
		config = data;
		var tmp  = config.TimeToSolve.split(':');

		initTime(parseInt(tmp[0]), parseInt(tmp[1]));

		if(config.ShowScoreOnlyAtTheEnd){
			$('#qvalue,#qvalue2').hide();
		} else {
			$('#qvalue_unknown,#qvalue2_unknown').hide();
		}
	})).done(setTimeout(function() {
		$('.loading').fadeOut();
	}, 1000));
});

//склоняем числительное {nom: 'минута', gen: 'минуты', plu: 'минут'}
function units(num, cases) {
	var word = (
		num % 10 == 1 && num % 100 != 11
			? cases.nom
			: num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
			? cases.gen
			: cases.plu
	)
	return word;
}

function submit_form(form) {
	var player_nickname = form.elements['nickname'].value;
	var player_record = form.elements['record'].value;

	$.post('/score', {"name": player_nickname, "score": player_record}, function() {
		window.location = '/total.html?score=' + player_record;
	});
}

function reload_records(data) {
	if (data === undefined) {
		$.get('/score', function(data) {
			reload_records(data);
		});
		return;
	}

	for (var i = 0; i < config.ScoresCount; i++) {
		if (data.length > i) {
			document.getElementById('name-' + i).innerHTML = data[i].Name;
			document.getElementById('record-' + i).innerHTML = data[i].Score;
		} else {
			document.getElementById('name-' + i).innerHTML = '';
			document.getElementById('record-' + i).innerHTML = '';
		}
	}
}
