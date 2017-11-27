$(function() {

    var chart;


	function renderChart(mappedData) {
		chart = Highcharts.stockChart('container', {
		        chart: {
		            zoomType: 'x'
		        },
		        title: {
		            text: 'Bitcoin Price'
		        },
		        subtitle: {
		            text: document.ontouchstart === undefined ?
		                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
		        },
		        xAxis: {
		            type: 'datetime',
		            // categories: formattedDate
		        },
		          yAxis: {
		            title: 'Price'
		            
		        },

		        tooltip: {
		            split: true
		        },
		        legend: {
		            enabled: false
		        },
		        plotOptions: {
		            area: {
		                fillColor: {
		                    linearGradient: {
		                        x1: 0,
		                        y1: 0,
		                        x2: 0,
		                        y2: 1
		                    },
		                    stops: [
		                        [0, Highcharts.getOptions().colors[0]],
		                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
		                    ]
		                },
		                marker: {
		                    radius: 2
		                },
		                lineWidth: 1,
		                states: {
		                    hover: {
		                        lineWidth: 1
		                    }
		                },
		                threshold: null
		            }
		        },

		        series: [{
		            type: 'area',
		            name: `Bitcoin in USD`,
		            data: mappedData
		        },
		        ]
		});
		}

	 function getDataAndShowChart() {
	 	$('.loader').show();
		 $.getJSON('https://api.blockchain.info/price/index-series?base=btc&quote=USD&start=1503145039&scale=7200', function (data) {
		 	var mappedData = data.map(function(element) {
		 		return [element.timestamp*1000, element.price];
		 	})

		 	// var volumeData = data.map(function(element) {
		 	// 	return [element.volume24h];
		 	// })

		 	// console.log('cachedData', cachedData);
		 	// console.log('volume24h', volumeData);

		 	renderChart(mappedData);
		
		})
		 .fail(function() {
		    console.log( "error" );
		    $('#container').append( "<h1>Chart Failed to load. Please refresh the page.</h1>" );
		  })
		.done(function() {
			console.log( "complete" );
			$(".loader").hide();  
		});
	}

	getDataAndShowChart();

	$('.convert').click(function(evt){
		evt.preventDefault();
		var dataCurrency = $(this).data('currency');
		getPriceRatioAndReRenderChart(dataCurrency);
	});

	window.getPriceRatioAndReRenderChart = function getPriceRatioAndReRenderChart(currency) {
		$('.loader').show();
		// get the price ratio for the one you're interested in
		$.getJSON(`https://api.fixer.io/latest?base=USD&symbols=USD,${currency}` , function(currencyRatioData) {
			var ratio = currencyRatioData.rates[currency];

			$.getJSON('https://api.blockchain.info/price/index-series?base=btc&quote=USD&start=1503145039&scale=7200', function (data) {
				if (ratio === undefined) {
					getDataAndShowChart();
				} else {
					var mappedData = data.map(function(element) {
						var ratioInt = element.price * ratio.toFixed(2)*1
			 			return [element.timestamp * 1000, ratioInt.toFixed(2) * 1]; //this gets the currency ratio
				 	});
				}

			    chart.update({
			        series: [{
			            type: 'area',
			            name: `Bitcoin in ${currency}`,
			            data: mappedData
			        }]
			    });
			});
		})
		.fail(function() {
		    console.log( "error" );
		    $('#container').append( "<h1>Chart Failed to load. Please refresh the page.</h1>" );
		  })
		.done(function() {
			console.log( "complete" );
			$(".loader").hide();  
		});
	}

// window.myTestFunction()

});

