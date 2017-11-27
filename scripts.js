$(function() {
    console.log( "ready!" );

    var chart;


function renderChart(mappedData) {
	chart = Highcharts.chart('container', {
	        chart: {
	            zoomType: 'x'
	        },
	        title: {
	            text: 'USD to EUR exchange rate over time'
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
	            title: {
	                text: 'Exchange rate'
	            }
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
	            name: 'USD to EUR',
	            data: mappedData
	        }]
	});// end chart
}

 function getDataAndShowChart() {
	 $.getJSON('https://api.blockchain.info/price/index-series?base=btc&quote=USD&start=1503145039&scale=7200', function (data) {
	 	var mappedData = data.map(function(element) {
	 		return [element.timestamp*1000, element.price];
	 	});

	 	// console.log('cachedData', cachedData);
	 	// console.log('mappedData', mappedData);

	 	renderChart(mappedData);
	
		$('.loader').show();
	});
}

getDataAndShowChart();

window.getPriceRatioAndReRenderChart = function getPriceRatioAndReRenderChart(currency) {
	// get the price ratio for the one you're interested in
	$.getJSON(`https://api.fixer.io/latest?base=USD&symbols=USD,${currency}` , function(currencyRatioData) {
		// var ratio = 1;
		// if(currency = 'pounds') {
		// 	ratio =.75;
		// } 
		// else if (currency = 'yen') {
		// 	ratio=1000;
		// }
		// end fake out api call to get ratio
		var ratio = currencyRatioData.rates[currency];

		$.getJSON('https://api.blockchain.info/price/index-series?base=btc&quote=USD&start=1503145039&scale=7200', function (data) {
			var mappedData = data.map(function(element) {
	 		return [element.timestamp*1000, element.price*ratio]; //this gets the currency ratio
		 	});

		    chart.update({
		        series: [{
		            type: 'area',
		            name: `USD to ${currency}`,
		            data: mappedData
		        }],
		        title: {
		            text: `USD to ${currency} exchange rate over time`
		        },
		        subtitle: {
		            text: 'Plain'
		        }
		    });
		});
	});
}

// window.myTestFunction()

// 	///
// 	 var dataArray = [];
//     var timestampsArray = [];

//     $.getJSON('https://api.blockchain.info/price/index-series?base=btc&quote=USD&start=1503145039&scale=7200', function (data) {
//     	var pricesArray = data.map(function(element){
//     		return [element.timestamp*1000, element.price];
//     	});
//     	var volumeArray = data.map(function(element){
//     		return [element.timestamp*1000, element.volume24h];
//     	})
// 		// $.each(data, function( key, value ) {
// 		// 	dataArray.push([value.timestamp*1000, value.price, value.volume24h]);
// 			// pricesArray.push(value.price);
// 			// jsDate = new Date(timestampsArray * 1000);
// 			// formattedDate = jsDate.getDate() + jsDate.getMonth() + jsDate.getFullYear();
// 			// timestampsArray.push(timestampsArray) 
// //		  console.log('timestamp: ' + value.timestamp, 'price ' + value.price, ' volume24h ' + value.volume24h);
// 	// console.log(dataArray);
// 	// });

//     // split the data set into ohlc and volume
//     var ohlc = [],
//         volume = [],
//         dataLength = data.length,
//         // set the allowed units for data grouping
//         groupingUnits = [[
//             'week',                         // unit name
//             [1]                             // allowed multiples
//         ], [
//             'month',
//             [1, 2, 3, 4, 6]
//         ]],

//         i = 0;

//         console.log(data)

//     for (i; i < dataLength; i += 1) {
//         ohlc.push([
//             data[i][0], // the date
//             data[i][1], // open
//             data[i][2], // high
//             data[i][3], // low
//             data[i][4] // close
//         ]);



//         volume.push([
//             data[i][0], // the date
//             data[i][5] // the volume
//         ]);
//     }



//     // create the chart
//     Highcharts.stockChart('container', {

//         rangeSelector: {
//             selected: 1
//         },

//         title: {
//             text: 'AAPL Historical'
//         },

//         yAxis: [{
//             labels: {
//                 align: 'right',
//                 x: -3
//             },
//             title: {
//                 text: 'OHLC'
//             },
//             lineWidth: 2,
//             resize: {
//                 enabled: true
//             }
//         }, {
//             labels: {
//                 align: 'right',
//                 x: -3
//             },
//             title: {
//                 text: 'Volume'
//             },
//             offset: 0,
//             lineWidth: 2
//         }],

//         tooltip: {
//             split: true
//         },

//         series: [{
//             type: 'column',
//             name: 'Volume',
//             data: volumeArray,
//             yAxis: 1,
//             // dataGrouping: {
//             //     units: groupingUnits
//             // }
//         }]
//     });
// }).fail(function() {
//     console.log( "error" );
//   })
//   .done(function() {
//     console.log( "complete" );
//     $(".loader").hide();  
//   });


});

