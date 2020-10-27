import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as helper from '../helperFunctions'
import { max, tree } from 'd3'
import * as panel from './panelData'
import * as filter from 'components/Filters/Filters'
import AreaIncEduFilter from 'components/Filters/AreaIncEdu'

interface P {
	width: number
	height: number
	cardInd: number
	data: RootReducerState['raw_data']
	isVisible: boolean
	section: string
}
const TestIncome: React.FC<P> = ({ width, height, data, cardInd, isVisible, section }) => {

	const [filter_val, set_filter] = useState("Overall")
	const [filter_Comb, set_filterComb] = useState("None")
	const [filter_Income, set_filterIncome] = useState("F0")
	const [filter_Education, set_filterEducation] = useState("None")
	const [filter_RDD, set_filterRDD] = useState("None")
	const [openFilter, set_openFilter] = useState('0vh')
	const [graphicFilter, set_graphic] = useState(999)
	let margin = { top: 40, right: 20, bottom: 20, left: 45 }
	let innerWidth = width - margin.left - margin.right
	let innerHeight = height - margin.top - margin.bottom;

	function Income(index: number) {

		const IncomeAgg = panel.IncomeData({ data: data, filter_val: filter_val, filter_Income: filter_Income, filter_Education: filter_Education, filter_RDD: filter_RDD })
		const Spending = panel.Spending({ data: data, filter_val: filter_val, filter_Income: filter_Income, filter_Education: filter_Education, filter_RDD: filter_RDD })
		const IncomeCI: Record<number, number[]> = {}
		const eName: Record<string, number> = {
			'February': 1,
			'MayFeb': 4,
			'AugFeb': 7,
			'AugExp': 9
		}
		const month: Record<string, number> = {
			"January": 0,
			"February": 1,
			"March": 2,
			"April": 3,
			"May": 4,
			"June": 5,
			"July": 6,
			"August": 7,
			"September": 8,
			"October": 9,
			"November": 10,
			"December": 11,
			'MayFeb': 4,
			'AugFeb': 7,
			'AugExp': 9
		}

		Object.keys(IncomeAgg['Income']).forEach((e) => {
			if ((e == 'February') || (e == 'MayFeb') || (e == 'AugFeb') || (e == 'AugExp')) {
				IncomeCI[month[e]] = [helper.getConfInt(IncomeAgg['Income'][e])[0], helper.getConfInt(IncomeAgg['Income'][e])[1]]
			}
		});

		const IncomeMean: Record<number, number> = {};
		const ExpMean: Record<number, number> = {};

		if (IncomeAgg['Income']['February'].length === 0) {
			IncomeMean[1] = 1
		} else {
			IncomeMean[1] = IncomeAgg['Income']['February'].reduce((a: number, b: number) => a + b, 0) / IncomeAgg['Income']['February'].length;
			[0, 1].forEach(i => IncomeCI[1][i] = 100 * IncomeCI[1][i] / IncomeMean[1])
		}
		Object.keys(IncomeAgg['Income']).forEach(e => {
			if ((e == 'MayFeb') || (e == 'AugFeb')) {
				if (IncomeAgg['Income'][e].length === 0) {
					IncomeMean[month[e]] = 0
				}
				else {
					IncomeMean[month[e]] = 100 * IncomeAgg['Income'][e].reduce((a: number, b: number) => (b + a), 0) / IncomeAgg['Income'][e].length;
					[0, 1].forEach(i => IncomeCI[month[e]][i] = 100 * IncomeCI[month[e]][i])
				}
			}
			if ((e == 'AugFeb') || (e == 'AugExp')) {
				if (IncomeAgg['Income'][e].length === 0) {
					ExpMean[month[e]] = 0
				}
				else {
					ExpMean[month[e]] = 100 * IncomeAgg['Income'][e].reduce((a: number, b: number) => (b + a), 0) / IncomeAgg['Income'][e].length;
					if (e == 'AugExp') {
						[0, 1].forEach(i => IncomeCI[month[e]][i] = 100 * IncomeCI[month[e]][i])
					}
				}
			}
		})

		const passedIncomeCI = Object.entries(IncomeCI)

		IncomeMean[1] = 100;

		// console.log('incCII', IncomeCI)
		// console.log('IncMean', IncomeMean)

		const SpendingCI: Record<number, number[]> = {}
		Object.keys(Spending).forEach((e) => {
			if ((e !== 'FebruaryR1') && (e !== 'FebruaryR2')) {
				SpendingCI[month[e]] = [helper.getConfInt(Spending[e])[0], helper.getConfInt(Spending[e])[1]]
			}
		});

		const SpendingMean: Record<string, number> = {};
		const SpendingExpMean: Record<number, number> = {};

		if (Spending['February'].length === 0) {
			SpendingMean[1] = 1
		} else {
			SpendingMean[1] = Spending['February'].reduce((a: number, b: number) => a + b, 0) / Spending['February'].length;
			[0, 1].forEach(i => SpendingCI[1][i] = 100 * SpendingCI[1][i] / SpendingMean[1])
		}
		Object.keys(Spending).forEach(e => {
			if ((e === 'May') || (e === 'August')) {
				if (Spending[e].length === 0) {
					SpendingMean[month[e]] = 0
				} else {
					if (e == 'May') {
						SpendingMean[month[e]] = 200 * Spending[e].reduce((a: number, b: number) => (b + a), 0) / Spending[e].length;
						[0, 1].forEach(i => SpendingCI[month[e]][i] = 200 * SpendingCI[month[e]][i])
					}
					else {
						SpendingMean[month[e]] = 100 * Spending[e].reduce((a: number, b: number) => (b + a), 0) / Spending[e].length;
						[0, 1].forEach(i => SpendingCI[month[e]][i] = 100 * SpendingCI[month[e]][i])
					}
				}
			}
			if ((e == 'August') || (e == 'AugExp')) {
				if (Spending[e].length === 0) {
					SpendingExpMean[month[e]] = 0
				}
				else {
					SpendingExpMean[month[e]] = 100 * Spending[e].reduce((a: number, b: number) => (b + a), 0) / Spending[e].length;
					if (e == 'AugExp') {
						[0, 1].forEach(i => SpendingCI[month[e]][i] = 100 * SpendingCI[month[e]][i])
					}
				}
			}
		})
		const passedSpendingCI = Object.entries(SpendingCI)
		SpendingMean[1] = 100;

		// g.selectAll('.LineArea').transition().duration(900).style('opacity', 0);
		// g.selectAll('.IncVsSpend').transition().duration(900).attr('opacity', 0);
		// g.selectAll('.PointIncVsSpend').transition().duration(800).attr('opacity', 0);
		// g.selectAll('.PointIncVsSpend').transition().delay(600).remove();

		const tooltipTable: Record<string, Record<string, string>> = {}
		Object.keys(IncomeAgg['Income']).forEach(e => {

			let percentile_25 = Math.round(0.25 * (IncomeAgg['Income'][e].length)) - 1;
			let percentile_50 = Math.round(0.5 * (IncomeAgg['Income'][e].length)) - 1;
			let percentile_75 = Math.round(0.75 * (IncomeAgg['Income'][e].length)) - 1;

			if (e == 'February') {
				tooltipTable[month[e]] = {
					'Value': IncomeMean[month[e]].toFixed(2) + '%',//
					'Mean': (IncomeAgg['Income'][e].reduce((a: number, b: number) => a + b, 0) / IncomeAgg['Income'][e].length).toFixed(2),
					'25 %': String((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_25]),
					'50 %': String((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_50]),
					'75 %': String((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_75]),
					'Count': String(IncomeAgg['Income'][e].length)
				};
			}
			else if ((e == 'MayFeb') || (e == 'AugFeb') || (e == 'AugExp')) {
				let FebRMean: number = 0;
				if (e == 'MayFeb') {

					FebRMean = IncomeAgg['Income']['FebruaryR1'].reduce((a: number, b: number) => a + b, 0) /
						IncomeAgg['Income']['FebruaryR1'].length
				}
				else if ((e == 'AugFeb') || (e == 'AugExp')) {

					FebRMean = IncomeAgg['Income']['FebruaryR2'].reduce((a: number, b: number) => a + b, 0) /
						IncomeAgg['Income']['FebruaryR2'].length
				}
				if (e != 'AugExp') {

					tooltipTable[month[e]] = {
						'Value': IncomeMean[month[e]].toFixed(2) + '%',
						'Mean': ((IncomeMean[month[e]] / 100) * FebRMean).toFixed(2),
						'25 %': ((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_25] * 100).toFixed(2) + '%',
						'50 %': ((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_50] * 100).toFixed(2) + '%',
						'75 %': ((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_75] * 100).toFixed(2) + '%',
						'Count': String(IncomeAgg['Income'][e].length)
					};
				}
				else {
					tooltipTable[month[e]] = {
						'Value': ExpMean[month[e]].toFixed(2) + '%',
						'Mean': ((ExpMean[month[e]] / 100) * FebRMean).toFixed(2),
						'25 %': ((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_25] * 100).toFixed(2) + '%',
						'50 %': ((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_50] * 100).toFixed(2) + '%',
						'75 %': ((IncomeAgg['Income'][e]).sort((a: number, b: number) => a - b)[percentile_75] * 100).toFixed(2) + '%',
						'Count': String(IncomeAgg['Income'][e].length)
					};
				}
			}
		})

		// console.log('tooltipp', tooltipTable)
		const tooltipSpendTable: Record<string, Record<string, string>> = {}
		Object.keys(Spending).forEach(e => {

			let percentile_25 = Math.round(0.25 * (Spending[e].length)) - 1;
			let percentile_50 = Math.round(0.5 * (Spending[e].length)) - 1;
			let percentile_75 = Math.round(0.75 * (Spending[e].length)) - 1;
			if ((e !== 'FebruaryR1') && (e !== 'FebruaryR2')) {
				if (e == 'February') {

					tooltipSpendTable[month[e]] = {
						'Value': SpendingMean[month[e]].toFixed(2) + '%',
						'Mean': (Spending[e].reduce((a: number, b: number) => a + b, 0) / Spending[e].length).toFixed(2),
						'25 %': String((Spending[e]).sort((a: number, b: number) => a - b)[percentile_25]),
						'50 %': String((Spending[e]).sort((a: number, b: number) => a - b)[percentile_50]),
						'75 %': String((Spending[e]).sort((a: number, b: number) => a - b)[percentile_75]),
						'Count': String(Spending[e].length)
					};
				}
				else {
					let FebRMean: number = 0;
					if (e == 'May') {

						FebRMean = Spending['FebruaryR1'].reduce((a: number, b: number) => a + b, 0) /
							Spending['FebruaryR1'].length
					}
					else if ((e == 'August') || (e == 'AugExp')) {

						FebRMean = Spending['FebruaryR2'].reduce((a: number, b: number) => a + b, 0) /
							Spending['FebruaryR2'].length
					}
					if (e != 'AugExp') {
						tooltipSpendTable[month[e]] = {
							'Value': SpendingMean[month[e]].toFixed(2) + '%',
							'Mean': ((SpendingMean[month[e]] / 100) * FebRMean).toFixed(2),
							'25 %': ((Spending[e]).sort((a: number, b: number) => a - b)[percentile_25] * 100).toFixed(2) + '%',
							'50 %': ((Spending[e]).sort((a: number, b: number) => a - b)[percentile_50] * 100).toFixed(2) + '%',
							'75 %': ((Spending[e]).sort((a: number, b: number) => a - b)[percentile_75] * 100).toFixed(2) + '%',
							'Count': String(Spending[e].length)
						};
					}
					else {
						tooltipSpendTable[month[e]] = {
							'Value': SpendingExpMean[month[e]].toFixed(2) + '%',
							'Mean': ((SpendingExpMean[month[e]] / 100) * FebRMean).toFixed(2),
							'25 %': ((Spending[e]).sort((a: number, b: number) => a - b)[percentile_25] * 100).toFixed(2) + '%',
							'50 %': ((Spending[e]).sort((a: number, b: number) => a - b)[percentile_50] * 100).toFixed(2) + '%',
							'75 %': ((Spending[e]).sort((a: number, b: number) => a - b)[percentile_75] * 100).toFixed(2) + '%',
							'Count': String(Spending[e].length)
						};
					}
				}
			}
		})

		let yLabel = ''
		let plotTitle = ''
		let xAxis;
		let xLabel;
		const tick: any = ""

		const g = d3.select('#IncomeSVG')

		let passedData: [string, number][];
		let ExpPassedData: [string, number][];
		let linearScale: any;
		let bandScale: any;
		let legend: Record<string, string> = {}
		let legendDot: Record<string, string> = {}

		helper.generateElements([['line', 1]], 'LineArea', g, 'path')
		helper.generateElements([['line', 1]], 'LineExpected', g, 'path')
		if ((index === 0) || (index === 1)) {

			yLabel = 'Percentage (%)'
			plotTitle = 'Line Chart 1'

			passedData = Object.entries(IncomeMean);
			ExpPassedData = Object.entries(ExpMean);
			[linearScale, bandScale] = helper.generateAxis(Object.keys(eName),
				[0, Math.max(170, 1.3 * Number(max(Object.values(IncomeMean))))], [0, innerWidth], [innerHeight, 0])
			bandScale.padding(1)

			bandScale =
				d3.scaleTime()
					//@ts-ignore
					.domain([new Date(2020, 0, 1), new Date(2020, 10, 31)])
					.range([0, innerWidth])

			makeLineMonth()

			legend = {
				'Line 1': '#344a62',
			}
			legendDot = {
				'Expected': '#344a62'
			}
			if (index == 1) {
				plotTitle = 'Line Chart 2'
				legend = {
					'Line 2': '#344a62',
				}
			}

			helper.showLegend(legend, g)
			helper.showLegendDot(legendDot, g, true)


			let line: any = d3.line()
				.x((d) => {
					return (bandScale(new Date(2020, d[0], 1)))
				})
				.y((d) => linearScale(d[1]))

			g.selectAll('.LineExpected')
				.datum(ExpPassedData)
				.attr("fill", "none")
				.style("stroke-dasharray", ("3, 3"))
				.transition().delay(500)
				.transition().duration(500)
				.attr("d", line)

			helper.highlight(passedData, g, bandScale, linearScale, 'Point', tooltipTable, true)
			helper.highlight(ExpPassedData, g, bandScale, linearScale, 'PointExp', tooltipTable, true)

			let area: any = d3.area().x((d) => bandScale(new Date(2020, d[0], 1)))
				//@ts-ignore
				.y0((d) => linearScale(d[1][0]))
				//@ts-ignore
				.y1((d) => linearScale(d[1][1]))

			g.selectAll('.LineArea')
				.datum(passedIncomeCI)
				.transition().delay(500)
				.transition().duration(500)
				.attr("d", area);

			//@ts-ignore
			xAxis = d3.axisBottom(bandScale)
				.tickValues([new Date(2020, 0, 1), new Date(2020, 1, 1), new Date(2020, 4, 1), new Date(2020, 7, 1),
				new Date(2020, 9, 1), new Date(2020, 11, 1)])
				//@ts-ignore
				.tickFormat(d3.timeFormat("%b"));
			xLabel = 'Months'

			helper.showXAxis(xAxis, g, innerHeight, innerWidth, xLabel)
			helper.showXGrid(xAxis.tickSize(-innerHeight).tickFormat(tick), g)

		}

		else if ((index === 2)) {
			// helper.generateElements([], 'LineExpected', g, 'path')

			yLabel = 'Percentage (%)'
			plotTitle = 'Line Chart 3'
			passedData = Object.entries(SpendingMean);
			ExpPassedData = Object.entries(SpendingExpMean);
			[linearScale, bandScale] = helper.generateAxis(Object.keys(eName),
				[0, Math.max(170, 1.1 * Number(max(Object.values(SpendingMean))))], [0, innerWidth], [innerHeight, 0])
			bandScale.padding(1)

			bandScale =
				d3.scaleTime()
					//@ts-ignore
					.domain([new Date(2020, 0, 1), new Date(2020, 10, 31)])
					.range([0, innerWidth])

			makeLineMonth()
			// makeLine()

			legend = {
				'Line 3': '#344a62'
			}
			legendDot = {
				'Expected': '#344a62'
			}
			helper.showLegend(legend, g)
			helper.showLegendDot(legendDot, g, true)

			// helper.generateElements([['line', 1]], 'LineExpected', g, 'path')

			let line: any = d3.line()
				.x((d) => {
					return (bandScale(new Date(2020, d[0], 1)))
				})
				.y((d) => linearScale(d[1]))

			g.selectAll('.LineExpected')
				.datum(ExpPassedData)
				.attr("fill", "none")
				.style("stroke-dasharray", ("3, 3"))
				.transition().delay(500)
				.transition().duration(500)
				.attr("d", line)

			helper.highlight(passedData, g, bandScale, linearScale, 'Point', tooltipSpendTable, true)
			helper.highlight(ExpPassedData, g, bandScale, linearScale, 'PointExp', tooltipSpendTable, true)

			// helper.highlight(passedData, g, bandScale, linearScale, 'Point', tooltipSpendTable)

			let area: any = d3.area().x((d) => bandScale(new Date(2020, d[0], 1)))
				//@ts-ignore
				.y0((d) => linearScale(d[1][0]))
				//@ts-ignore
				.y1((d) => linearScale(d[1][1]))

			g.selectAll('.LineArea')
				.datum(passedSpendingCI)
				.transition().delay(500)
				.transition().duration(500)
				.attr("d", area)


			xAxis = d3.axisBottom(bandScale)
				.tickValues([new Date(2020, 0, 1), new Date(2020, 1, 1), new Date(2020, 4, 1), new Date(2020, 7, 1),
				new Date(2020, 9, 1), new Date(2020, 11, 1)])
				//@ts-ignore
				.tickFormat(d3.timeFormat("%b"));

			xLabel = 'Months'

			helper.showXAxis(xAxis, g, innerHeight, innerWidth, xLabel)
			helper.showXGrid(xAxis.tickSize(-innerHeight).tickFormat(tick), g)

		}

		const yAxis = d3.axisLeft(linearScale)
		helper.showYAxis(yAxis, g, innerHeight, innerWidth, yLabel, margin)
		helper.plotTitle(g, innerWidth, plotTitle)

		helper.showYGrid(yAxis.tickSize(-innerWidth).tickFormat(tick), g)

		function makeLineMonth() {

			helper.generateElements([['line', 1]], 'LineGraph', g, 'path')

			let line: any = d3.line()
				.x((d) => bandScale(new Date(2020, d[0], 1)))
				.y((d) => linearScale(d[1]))

			g.selectAll('.LineGraph')
				.datum(passedData)
				.attr("fill", "none")
				.transition().delay(500)
				.transition().duration(500)
				.attr("d", line)
		}

		g.selectAll('.legend')
			.attr('transform', `translate(${bandScale.range()[1] - 140},${margin.top})`)

		// g.transition().duration(900)
		g.attr('transform', `translate(${margin.left},${margin.top})`)
	}

	let activeIndex = 0;
	let lastIndex = -1;

	const scrollVis = (index: number) => {
		const g = d3.select('#IncomeSVG')

		helper.createGrid(g, innerHeight)
		helper.createAxis(g, innerHeight)
		helper.generateElements([['legend', 1]], 'legend', g, 'g')

		activeIndex = index;

		const sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
		const scrolledSections = [activeIndex]

		scrolledSections.forEach(function (i) {
			Income(i);
		});
		lastIndex = activeIndex;
	};

	const pan = d3.select('.' + section)

	useEffect(() => {
		if (cardInd === 1) {
			set_filterComb('F1')
		}
		else {
			set_filterComb('None')
		}
		set_filterRDD("None")
	}, [cardInd, isVisible]);

	useEffect(() => {
		set_filter('Overall')
		set_filterIncome('F0')
		set_filterEducation('None')
		if (filter_Comb != 'None') {

			if ((filter_Comb == 'Rural') || (filter_Comb == 'Urban')) {
				set_filter(filter_Comb)
			}
			else if ((filter_Comb == 'F1') || (filter_Comb == 'F2')) {
				set_filterIncome(filter_Comb)
			}
			else {
				set_filterEducation(filter_Comb)
			}
		}
	}, [filter_Comb]);

	useEffect(() => {

		(window.matchMedia("(max-width: 767px)").matches) ?
			set_openFilter('0vh') : set_openFilter('auto');
		if (isVisible) {
			pan.selectAll('.card')
				.style('opacity', function (d, i) { return i === cardInd ? 1 : 0.3; });

			d3.select('#IncomeSVG')
				.style('opacity', 1);
			scrollVis(cardInd);
		} else {
			pan.selectAll('.card')
				.style('opacity', 0.4);

			d3.select('#IncomeSVG')
				.style('opacity', 0.4);
		}
		set_graphic(999)
	}, [isVisible, cardInd, data, width, height, filter_val, filter_Income, filter_Education, filter_RDD]);

	return <div id='Income' className="section" style={{ width: `${width}`, height: `${((height + 120) * 4) + 300}px` }}>
		<div id='graphic' className={section} style={{ zIndex: graphicFilter }}>
			<div id="0" className="card" >
				<div className="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Duis facilisis suscipit dui accumsan mattis.
				</div>
			</div>
			<div id="1" className="card" >
				<div className="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Duis facilisis suscipit dui accumsan mattis.
				</div>
			</div>
			<div id="2" className="card" >
				<div className="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Duis facilisis suscipit dui accumsan mattis.
				</div>
			</div>
		</div>
		<div id='vis' style={{ height: height + 120 }} >
			<svg width={width} height={height + 20} >
				<g id='IncomeSVG' />
			</svg>
			<div id="filter" style={{ gridTemplateColumns: 'repeat(1, 1fr)', height: openFilter, width: width }}>
				<span className="close" onClick={() => { set_openFilter('0vh'); set_graphic(999) }}>&times;</span>
				<AreaIncEduFilter set_filterAreaIncEdu={set_filterComb} value={filter_Comb} />
			</div>
			<button className='Filter_Button' onClick={() => {
				if (openFilter == '0vh') {
					set_openFilter('20vh'); set_graphic(-1)
				} else {
					set_openFilter('0vh'); set_graphic(999)
				}
			}}>Filters</button>
		</div>
	</div >
}

export default TestIncome;