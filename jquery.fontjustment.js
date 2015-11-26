/*
	Fontjustment
	Version 1.0
	By Alireza Asadi
*/

(function($){
	$.fn.fontjustment = function(options){


		var settings = $.extend({

		}, options);


		var getReadWidth = function (element) {
		    var wrapper = document.createElement('span'),
		        result;
		    while (element.firstChild) {
		        wrapper.appendChild(element.firstChild);
		    }
		    element.appendChild(wrapper);
		    result = wrapper.offsetWidth;
		    element.removeChild(wrapper);
		    while (wrapper.firstChild) {
		        element.appendChild(wrapper.firstChild);
		    }
		    return result;
		};


		var char_truncate = function(_this){
			var truncated = false;
			var val = _this.html();

			// Backup originalText
			if(settings.cache){
				if(!_this.attr("data-org-none-trunc"))
					_this.attr("data-org-none-trunc", val);
				else{
					val = _this.attr("data-org-none-trunc");
					_this.html(val);
				}
			}


			var parsed = parser(val);
			var numOfLines = _numberOfLine(_this);
			
			truncated = (parsed.totalChars > settings.max);

			// If truncated char is not space
			if(truncated){
				if(val.substr(settings.max-1,1) != ' '){
					settings.max = val.lastIndexOf(' ', settings.max);
				}
				var newText = val.substr(0, settings.max);
				_this.html(newText);


				_this.append('<span class="ellipsis">' + settings.ellipsis + '</span>');
			}

		};

		var init = function(_this){
			_this.addClass('fontjustment-applied');
			var defaultFontSize = _this.attr('data-default-size');
			if(!defaultFontSize){
				defaultFontSize = _this.css('font-size');
				_this.attr('data-default-size', defaultFontSize);
			}

			_this.css('font-size', defaultFontSize);
			var realWidth = getReadWidth(_this.get(0));
			var width = _this.width();
			var size = 0;
			var sizeUnit = 'px';
			if(defaultFontSize.indexOf('px') > -1){
				sizeUnit = 'px';
				size = parseInt(defaultFontSize.replace('px'));
			}else if(defaultFontSize.indexOf('em') > -1){
				sizeUnit = 'em';
				size = parseFloat(defaultFontSize.replace('em'));
			}else if(defaultFontSize.indexOf('pt') > -1){
				sizeUnit = 'pt';
				size = parseInt(defaultFontSize.replace('pt'));
			}

			while(realWidth > width && size > 0){
				_this.css('font-size', size + sizeUnit);
				realWidth = getReadWidth(_this.get(0));

				if(sizeUnit == 'em')
					size-=0.01;
				else
					size--;
			}
		};

		return this.each(function(){
			var _this = $(this);
			init(_this);


	    	$(window).resize(function(){
				init(_this);
	    	});
		});
	};
}(jQuery));
