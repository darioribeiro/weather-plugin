(function ( $ ) {

	"use strict";

	var request;

	const methods = {

		init: function(options){

			this.each( i );

			function i(){

				const d = new Date();
				const obj = $(this);

				var obj_temp;
				var temperatura;
				var temperatura_text;

				var settings = {
					"cidade":'Osório',
					"estado":'RS',
					"u":"celsius",
					"dia": day_week(d.getDay())
				};

				if(typeof(options) === "object"){
					$.extend(true, settings, options);
				}

				request(settings.cidade,settings.estado, show);

				var $celsius = function(temp) {return Math.round((temp - 32) / (9 / 5));};

				function show (data){
					var forecast = data.query.results.channel.item.forecast;

					$.each(forecast,function(){

						if(this.day == settings.dia){
							if(settings.u === "celsius"){
								temperatura = {"min":($celsius(this.high)) + " Cº", "max":($celsius(this.low)) + " Cº"};
							}else{
								temperatura = {"max":this.high + " Fº","min":this.low + " Fº"};
							}
							temperatura_text = this.text;

							obj_temp = {
								'temperatura':temperatura,
								'text':temperatura_text
							};


							obj.find('.temp-min').text(temperatura.min);
							obj.find('.temp-max').text(temperatura.max);
							obj.find('.temp-texto').text(temperatura_text);

							obj.attr('tempmax',temperatura.max);
							obj.attr('tempmin',temperatura.min);
							obj.attr('temptext',temperatura_text);


						}
					});

				};

				
			}

			return request;''
		},

		getValue: function(){
			var obj = [];

			this.each(i);

			function i (){
				var _obj = {};
	
					_obj.tempmax = $(this).attr('tempmax');
					_obj.tempmin = $(this).attr('tempmin');
					_obj.temptext = $(this).attr('temptext');
	

				obj.push(_obj);
			} 

			return obj;
		}
	};



	function request( cidade, estado ,callback){

		const query  = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+cidade+','+estado+'")';
		const options = {
			"q":query,
			"format":"json",
		};

		request = $.getJSON("https://query.yahooapis.com/v1/public/yql",options,callback);
	}


	function day_week(day){
		var day_week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		return (day_week[day]);
	}


	$.fn.weather = function(method) {


		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if(typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);
		else
			$.error( 'the method ' +  method + ' does not exist on weather' );

	}


}( jQuery ));
