
// flex-container column for all elements
const flex = d3
	.select('body')
	.append('div')
	.attr('class', 'flex-container')
	.attr('id', 'flex-container')

// page title
const header = d3
	.select('#flex-container')
	.append('h1')
	.text('Crypto')

// navbar
const navbar = d3
	.select('body')
	.append('div')
	.attr('class', 'navbar')
	.attr('id', 'navbar')

// button to navigate to stock data
const navButtonWrapperStocks = d3
	.select('#navbar')
	.append('div')
	.attr('class', 'nav-button-wrapper')
	.attr('id', 'nav-button-wrapper-stocks')
const navButtonStocks = d3
	.select('#nav-button-wrapper-stocks')
	.append('button')
	.attr('class', 'nav-button')
	.attr('id', 'nav-button-stocks')
	.text('Stocks!!')

// button to navigate to crypto data
const navButtonWrapperCrypto = d3
	.select('#navbar')
	.append('div')
	.attr('class', 'nav-button-wrapper')
	.attr('id', 'nav-button-wrapper-crypto')
const navButtonCrypto = d3
	.select('#nav-button-wrapper-crypto')
	.append('button')
	.attr('class', 'nav-button')
	.attr('id', 'nav-button-crypto')
	.text('Crypto!!')


// filter-container
const filterContainer = d3
	.select('#flex-container')
	.append('div')
	.attr('class', 'filter-container')
	.attr('id', 'filter-container')


const startDatePickerWrapper = d3
	.select('#filter-container')
	.append('div')
	.attr('class', 'start-date-picker-wrapper')
	.attr('id', 'start-date-picker-wrapper')
	.text('Start Date')


const startDatePicker = d3
	.select('#filter-container')
	.append('input')
	.attr('class', 'start-date-picker')
	.attr('id', 'start-date-picker')
	.attr('type', 'date')
	.attr('value', `${formatDate(new Date())}`)

const endDatePickerWrapper = d3
	.select('#filter-container')
	.append('div')
	.attr('class', 'end-date-picker-wrapper')
	.attr('id', 'end-date-picker-wrapper')
	.text('End Date')

const endDatePicker = d3
	.select('#filter-container')
	.append('input')
	.attr('class', 'end-date-picker')
	.attr('id', 'end-date-picker')
	.attr('type', 'date')

// formatDate to get dates in 'YYYY-MM-DD' format
function formatDate(date) {
	var monthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	];

	var monthNum = date.getMonth() + 1; // fix 0 indexed month

	var day = '0' + date.getDate();
	var monthIndex = '0' + monthNum;
	var year = date.getFullYear();

	return year + '-' + monthIndex.slice(-2) + '-' + day.slice(-2);
}

// PRICE CHART!@!!@!@!@!@!@!@!@!@!@!@!@!@!@@!@!@!@!@!@!@!@!@@!@!@!@!@!@!@!@!@@!
var loadData = fetch('http://localhost:4000/chart')
	.then(response => response.json())
	.then(data => {

		const margin = { top: 50, right: 50, bottom: 50, left: 50 };
		const width = window.innerWidth - margin.left - margin.right;
		const height = window.innerHeight - margin.top - margin.bottom;


		const chartResultsData = data['chart']['result'][0];
		const quoteData = chartResultsData['indicators']['quote'][0];

		return chartResultsData['timestamp'].map((time, index) => ({
			date: new Date(time * 1000),
			close: quoteData['close'][index],
			open: quoteData['open'][index],
			volume: quoteData['volume'][index]
		}))
	});

// var loadData = fetch('http://localhost:4000/crypto')
// 	.then(response => response.json())
// 	.then(data => {
// 		const margin = { top: 50, right: 50, bottom: 50, left: 50 };
// 		const width = window.innerWidth - margin.left - margin.right;
// 		const height = window.innerHeight - margin.top - margin.bottom;
//
// 		let coinData = [];
//
// 		for (let i = 0; i < 10; i++) {
//
// 			for (let j = 0; j < 365; j++){
// 				let tempDate = new Date(data[i]['time'].split('-')[0] + '-' + data[i]['time'].split('-')[1] + '-' + data[i]['time'].split('-')[2]);
// 				let dateOffset = (24*60*60*1000) * (365 - i); //5 days
// 				tempDate = new Date(tempDate - dateOffset);
// 				console.log(tempDate);
//
// 				let coinDataFrame = {
// 					date: tempDate,
// 					test: `${(365-j)} days ago`,
// 					coin: data[i]['coin'],
// 					priceHistory: data[i]['priceHistory'][j]
// 				};
// 				coinData.push(coinDataFrame);
// 			}
// 		}
//
// 		return coinData;
// 	});

// responsivefy method
const responsivefy = svg => {
	// get container + svg aspect ratio
	const container = d3.select(svg.node().parentNode),
	width = parseInt(svg.style('width')),
	height = parseInt(svg.style('height')),
	aspect = width / height;

	// get width of container and resize svg to fit it
	const resize = () => {
	var targetWidth = parseInt(container.style('width'));
		svg.attr('width', targetWidth);
		svg.attr('height', Math.round(targetWidth / aspect));
	};

	// add viewBox and preserveAspectRatio properties,
	// and call resize so that svg resizes on inital page load
	svg
		.attr('viewBox', '0 0 ' + width + ' ' + height)
		.attr('perserveAspectRatio', 'xMinYMid')
		.call(resize);

	// to register multiple listeners for same event type,
	// you need to add namespace, i.e., 'click.foo'
	// necessary if you call invoke this function for multiple svgs
	// api docs: https://github.com/mbostock/d3/wiki/Selections#on
	d3.select(window).on('resize.' + container.attr('id'), resize);
};

// call function to build chart
loadData.then(data => {
	initialiseChart(data);
});

// build chart
const initialiseChart = data => {
	const margin = { top: 50, right: 50, bottom: 50, left: 50 };
	const width = window.innerWidth - margin.left - margin.right;
	const height = window.innerHeight - margin.top - margin.bottom;

	// add chart wrapper to page
	const chart = d3
		.select('#flex-container')
		.append('div')
		.attr('id', 'chart');

	// add SVG to the page, inside of #chart div
	const svg = d3
		.select('#chart')
		.append('svg')
		.attr('width', width + margin['left'] + margin['right'])
		.attr('height', height + margin['top'] + margin['bottom'])
		.call(responsivefy)
		.append('g')
		.attr('transform', `translate(${margin['left']},	${margin['top']})`);

	// find data range
	const xMin = d3.min(data, d => {
		return d['date'];
	});
	const xMax = d3.max(data, d => {
		return d['date'];
	});
	const yMin = d3.min(data, d => {
		return d['close'];
	});
	const yMax = d3.max(data, d => {
		return d['close'];
	});

	// scales for the charts
	const xScale = d3
		.scaleTime()
		.domain([xMin, xMax])
		.range([0, width]);
	const yScale = d3
		.scaleLinear()
		.domain([yMin - 5, yMax])
		.range([height, 0]);
	const zScale = d3
		.scaleLinear()
		.domain([0, 30])
		.range([height, 0]);

	// create the axes component
	svg
		.append('g')
		.attr('id', 'xAxis')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(xScale));
	svg
		.append('g')
		.attr('id', 'yAxis')
		.attr('transform', `translate(${width}, 0)`)
		.call(d3.axisRight(yScale));
	svg
		.append('g')
		.attr('id', 'zAxis')
		.attr('transform', `translate(0, 0)`)
		.call(d3.axisLeft(zScale));


	// generates close price line chart when called
	const line = d3
		.line()
		.x(d => {
			return xScale(d['date']);
		})
		.y(d => {
			return yScale(d['close']);
		});
	// Append the path and bind data
		svg
			.append('path')
			.data([data])
			.style('fill', 'none')
			.attr('id', 'priceChart')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', '1.5')
			.attr('d', line);

	const movingAverage = (data, numberOfPricePoints) => {
		return data.map((row, index, total) => {
			const start = Math.max(0, index - numberOfPricePoints);
			const end = index;
			const subset = total.slice(start, end + 1);
			const sum = subset.reduce((a, b) => {
				return a + b['close'];
			}, 0);
			return {
				date: row['date'],
				average: sum / subset.length
			};
		});
	};

	// calculates simple moving average over 50 days
	const movingAverageData = movingAverage(data, 49);
		// // generates moving average curve when called
		const movingAverageLine = d3
			.line()
			.x(d => {
				return xScale(d['date']);
			})
			.y(d => {
				return yScale(d['average']);
			})
				.curve(d3.curveBasis);
			svg
				.append('path')
				.data([movingAverageData])
				.style('fill', 'none')
				.attr('id', 'movingAverageLine')
				.attr('stroke', '#FF8900')
				.attr('d', movingAverageLine);

		/* Volume series bars */
		const volData = data.filter(d => d['volume'] !== null && d['volume'] !== 0);
		const yMinVolume = d3.min(volData, d => {
			return Math.min(d['volume']);
		});
		const yMaxVolume = d3.max(volData, d => {
			return Math.max(d['volume']*4);
		});
		const yVolumeScale = d3
			.scaleLinear()
			.domain([yMinVolume, yMaxVolume])
			.range([height, 0]);
		svg
			.selectAll()
			.data(volData)
			.enter()
			.append('rect')
			.attr('x', d => {
				return xScale(d['date']);
			})
			.attr('y', d => {
				return yVolumeScale(d['volume']);
			})
			.attr('fill', (d, i) => {
				if (i === 0) {
					return '#03a678';
				} else {
					return volData[i - 1].close > d.close ? '#c0392b' : '#03a678';
				}
			})
			.attr('width', 1)
			.attr('height', d => {
				return height - yVolumeScale(d['volume']);
			});

	// renders x and y crosshair
	const focus = svg
		.append('g')
		.attr('class', 'focus')
		.style('display', 'none');
	focus.append('circle').attr('r', 4.5);
	focus.append('line').classed('x', true);
	focus.append('line').classed('y', true);
	svg
		.append('rect')
		.attr('class', 'overlay')
		.attr('width', width)
		.attr('height', height)
		.on('mouseover', () => focus.style('display', null))
		.on('mouseout', () => focus.style('display', 'none'))
		.on('mousemove', generateCrosshair);
	d3.select('.overlay').style('fill', 'none');
	d3.select('.overlay').style('pointer-events', 'all');
	d3.selectAll('.focus line').style('fill', 'none');
	d3.selectAll('.focus line').style('stroke', '#67809f');
	d3.selectAll('.focus line').style('stroke-width', '1.5px');
	d3.selectAll('.focus line').style('stroke-dasharray', '3 3');

	const bisectDate = d3.bisector(d => d.date).left;
	function generateCrosshair() {
		//returns corresponding value from the domain
		const correspondingDate = xScale.invert(d3.mouse(this)[0]+(width/1.9));
		//gets insertion point
		const i = bisectDate(data, correspondingDate, 1);
		const d0 = data[i - 1];
		const d1 = data[i];
		const currentPoint = correspondingDate - d0['date'] < d1['date'] - correspondingDate ? d1 : d0;

		focus.attr('transform',`translate(${xScale(currentPoint['date'])}, ${yScale(currentPoint['close'])})`);
		focus
			.select('line.x')
			.attr('x1', 0)
			.attr('x2', width - xScale(currentPoint['date']))
			.attr('y1', 0)
			.attr('y2', 0);
		focus
			.select('line.y')
			.attr('x1', 0)
			.attr('x2', 0)
			.attr('y1', 0)
			.attr('y2', height - yScale(currentPoint['close']));
		updateLegends(currentPoint);
	}

	const updateLegends = currentData => {
		d3.selectAll('.lineLegend').remove();
	const legendKeys = Object.keys(data[0]);
	const lineLegend = svg
		.selectAll('.lineLegend')
		.data(legendKeys)
		.enter()
		.append('g')
		.attr('class', 'lineLegend')
		.attr('transform', (d, i) => {
			return `translate(0, ${i * 20})`;
		});
	lineLegend
		.append('text')
		.text(d => {
				if (d === 'date') {
				return `${d}: ${currentData[d].toLocaleDateString()}`;
			} else if ( d === 'high' || d === 'low' || d === 'close' || d === 'price') {
				return `price: ${currentData[d].toFixed(2)}`;
			} else if ( d === 'volume') {
				return `upvotes: ${Math.round(currentData[d]/1000)}`;
			} else if ( d === 'open') {
				return `mentions: ${Math.round(currentData[d]/6)}`;
			} else {
				return `${d}: ${currentData[d]}`;
			}
		})
		.style('fill', 'white')
		.attr('transform', 'translate(15,9)');
  };

} // end building of chart

// ----------------------------------------------------------------------------
// ---------------------------- OLD CODE --------------------------------------
// ----------------------------------------------------------------------------

// set the dimensions and margins of the graph
// const margin = { top: 20, right: 20, bottom: 30, left: 40 };
// const width = 960 - margin.left - margin.right;
// const height = 500 - margin.top - margin.bottom;

// // set the ranges for the graph
// const x = d3
// 	.scaleBand()
// 	.range([0, width])
// 	.padding(0.1);
//
// const y = d3.scaleLinear().range([height, 0]);

// let date_left = new Date(2020, 0, 1);
// let date_right = new Date(2020, 0, 11);
// let number_left =
// let number_right =

// const timeScale = d3.time.scale()
// 	.domain([date_left, date_right])
// 	.range([number_left, number_right]);


// append the container for the r/Cryptocurrency graph
// const item = d3
// 	.select('#flex-container')
// 	.append('div')
// 	.attr('class', 'item')
// 	.attr('id', 'cryptocurrencies');
//
// item.append('h1').text('r/Cryptocurrency');
//
// // append the container for the r/Stocks graph
// const item2 = d3
// 	.select('#flex-container')
// 	.append('div')
// 	.attr('class', 'item')
// 	.attr('id', 'stocks');
//
// item2.append('h1').text('r/Stocks');


// // append the svg object to the body of the page
// // append a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// const svg = item
// 	.append('svg')
// 	.attr('width', width + margin.left + margin.right)
// 	.attr('height', height + margin.top + margin.bottom)
// 	.append('g')
// 	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//
// const svg2 = item2
// 	.append('svg')
// 	.attr('width', width + margin.left + margin.right)
// 	.attr('height', height + margin.top + margin.bottom)
// 	.append('g')
// 	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// // Create a skeleton structure for a tooltip and append it to the page
// const tip = d3
// 	.select('body')
// 	.append('div')
// 	.attr('class', 'tooltip');


// // get crpytocurrency data
// // Get the crypto data from the `/crypto` endpoint
// fetch('http://localhost:4000/crypto')
// 	.then(response => response.json())
// 	.then(crypto => {
// 	// add the x Axis
// 	svg
// 		.append('g')
// 		.attr('transform', 'translate(0,' + height + ')')
// 		.attr('class', 'x-axis')
// 		.call(d3.axisBottom(x));
//
// 	// add the y Axis
// 	svg
// 		.append('g')
// 		.attr('class', 'y-axis')
// 		.call(d3.axisLeft(y));
//
// 	update(crypto, svg);
// 	});

// // get stock data
// fetch('http://localhost:4000/stocks')
// 	.then(response => response.json())
// 	.then(stocks => {
// 	// add the x Axis
// 	svg2
// 		.append('g')
// 		.attr('transform', 'translate(0,' + height + ')')
// 		.attr('class', 'x-axis')
// 		.call(d3.axisBottom(x));
//
// 	// add the y Axis
// 	svg2
// 		.append('g')
// 		.attr('class', 'y-axis')
// 		.call(d3.axisLeft(y));
//
// 	update(stocks, svg2);
// 	});

// function update(data, svg) {
// 	// Scale the range of the data in the x axis
// 	x.domain(
// 		data.map(d => {
// 			return d.name;
// 		})
// 	);
//
// 	// Scale the range of the data in the y axis
// 	y.domain([
// 		0,
// 		d3.max(data, d => {
// 			return d.votes + 200;
// 		}),
// 	]);
//
// 	// Select all bars on the graph, take them out, and exit the previous data set.
// 	// Enter the new data and append the rectangles for each object in the data array
// 	svg
// 		.selectAll('.bar')
// 		.remove()
// 		.exit()
// 		.data(data)
// 		.enter()
// 		.append('rect')
// 		.attr('class', 'bar')
// 		.attr('x', d => {
// 			return x(d.name);
// 		})
// 		.attr('width', x.bandwidth())
// 		.attr('y', d => {
// 			return y(d.votes);
// 		})
// 		.attr('height', d => {
// 			return height - y(d.votes);
// 		})
// 		.on('mousemove', d => {
// 			tip
// 			.style('position', 'absolute')
// 			.style('left', `${d3.event.pageX + 10}px`)
// 			.style('top', `${d3.event.pageY + 20}px`)
// 			.style('display', 'inline-block')
// 			.style('opacity', '0.9')
// 			.html(
// 				`<div><strong>${d.name}</strong></div> <span>${d.votes} votes</span>`
// 			);
// 		})
// 		.on('mouseout', () => tip.style('display', 'none'));
//
// 	// update the x-axis
// 	svg.select('.x-axis').call(d3.axisBottom(x));
//
// 	// update the y-axis
// 	svg.select('.y-axis').call(d3.axisLeft(y));
// }
