import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { max } from 'd3'
import * as helper from '../helperFunctions'
import * as panel from './panelData'
import * as filter from 'components/Filters/Filters'
import AreaEduFilter from 'components/Filters/AreaEdu'
import LockEffect from 'components/D3Panels/LockEffectFunc'
import FoodClus from 'components/D3Panels/Chapter2/FoodClusFunc'

interface P {
	width: number
	height: number
	cardInd: number
	data: RootReducerState['raw_data']
	isVisible: boolean
	section: string
}
// const order: Record<string, string> = {
// 	"No bill missed": 'Tick 1',
// 	"Electricity Bill":'Tick 2',
// 	"Loan Payment (Informal)":'Tick 3',
// 	"Rent":'Tick 4',
// 	"Medical Bills":'Tick 5',
// 	"School Fees":'Tick 6',
// 	"Gas Bill":'Tick 7',
// 	"Water Bill":'Tick 8',
// 	"Phone Bill":'Tick 9',
// 	"Loan Payment (bank)":'Tick 10',
// 	"Ration/ Store loan from local general store":'Tick 11',
// }
const MissedPayments: React.FC<P> = ({ width, height, data, cardInd, isVisible, section }) => {

	const margin = { top: 40, right: 20, bottom: 20, left: 65 }
	const [filter_val, set_filter] = useState("Overall")
	const [filter_Comb, set_filterComb] = useState("None")
	const [filter_Education, set_filterEducation] = useState("None")
	const [filter_Round, set_filterRound] = useState(1)
	const [filter_RDD, set_filterRDD] = useState("None")
	const [openFilter, set_openFilter] = useState('0vh')
	const [graphicFilter, set_graphic] = useState(999)

	const innerWidth = width - margin.left - margin.right
	const innerHeight = height - margin.top - margin.bottom

	function MissedPayments(index: number) {

		if ((index === 0) || (index === 1)) {

			const MissedPayments = panel.MissedPayments(data, filter_val, filter_Round, filter_Education, filter_RDD)
			let job_n = Object.values(MissedPayments).reduce((a: number, b: number) => a + b, 0)

			const tooltipMissedPayments: Record<string, Record<string, string>> = {}
			Object.keys(MissedPayments).forEach(e => {
				tooltipMissedPayments[e] = {
					'Value': (100 * MissedPayments[e] / job_n).toFixed(2) + '%',
					'Count': String(MissedPayments[e]),
				};
			})
			Object.keys(MissedPayments).forEach((e) => MissedPayments[e] = 100 * MissedPayments[e] / job_n)

			const order_by_ordering = ([a1, k1]: [any, number], [a2, k2]: [any, number]) => k2 - k1

			const g = d3.select('#MissedPaymentsSVG')
			helper.generateElements([], 'gBarFood', g)

			const t = g.transition().duration(650);

			const [linearScale, bandScale] = helper.generateAxis(Object.entries(MissedPayments).sort(order_by_ordering).map(([a, b]) => a),
				[0, Math.max(65, Number(max(Object.values(MissedPayments))))], [0, innerHeight], [0, innerWidth])

			bandScale.padding(0.2)

			const xAxis = d3.axisBottom(linearScale)
			const yAxis = d3.axisLeft(bandScale)

			let passedData;

			let plotTitle = ""
			if ((index === 0) || (index === 1)) {
				plotTitle = "Horizontal Bar Chart"
				if (index == 1) {
					plotTitle = 'Horizontal Bar Chart 2'
				}
				passedData = Object.entries(MissedPayments).sort(order_by_ordering)
				helper.generateElements(passedData, 'BarGraph', g)
				g.selectAll('.BarGraph')
					.call(s => s.transition(t)
						.attr('y', (d: any) => bandScale(d[0]))
						.attr('height', bandScale.bandwidth())
						.attr('width', (d: any) => Math.max(0, linearScale(d[1])))
						.attr('x', 0)
						.delay((d, i) => (i * 60))
					)

				helper.highlightBar({
					selection: g, bandScale: bandScale, linearScale: linearScale,
					className: 'BarGraph', margin: margin,
					tooltipTable: tooltipMissedPayments
				})
			}

			const xLabel = 'Percentage (%)';
			const yLabel = 'Y-Label';

			helper.plotTitle(g, innerWidth, plotTitle, -15)
			helper.showXAxis(xAxis, g, innerHeight, innerWidth, xLabel)
			helper.showYAxis(yAxis, g, innerHeight, innerWidth, yLabel, margin)

			g.transition().duration(650)
				.attr('transform', `translate(${margin.left},${margin.top})`)
		}
		else if (index == 2) {
			LockEffect({
				filter_Education: filter_Education, filter_RDD: filter_RDD,
				filter_Round: filter_Round, filter_val: filter_val, width: width,
				height: height, cardInd: cardInd, data: data
			})
		}
		else if (index > 2) {
			FoodClus({
				filter_Education: filter_Education, filter_RDD: filter_RDD,
				width: width, height: height, cardInd: cardInd, data: data
			})
		}
	};

	let activeIndex = 0;
	let lastIndex = -1;

	const scrollVis = (index: number) => {

		const g = d3.select('#MissedPaymentsSVG')

		helper.createAxis(g, innerHeight)
		activeIndex = index;
		const sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
		const scrolledSections = [activeIndex]

		scrolledSections.forEach(function (i) {
			MissedPayments(i);
		});
		lastIndex = activeIndex;

		(window.matchMedia("(max-width: 767px)").matches) ?
			set_openFilter('0vh') : set_openFilter('auto');
	};

	const pan = d3.select('.' + section)

	useEffect(() => {
		if (cardInd === 1) {
			set_filterRound(2)
		}
		else {
			set_filterRound(1)
		}
		set_filterRDD("None")
		set_filterComb('None')
	}, [cardInd, isVisible]);

	useEffect(() => {
		set_filter('Overall')
		set_filterEducation('None')
		if (filter_Comb != 'None') {

			if ((filter_Comb == 'Rural') || (filter_Comb == 'Urban')) {
				set_filter(filter_Comb)
			}
			else {
				set_filterEducation(filter_Comb)
			}
		}
	}, [filter_Comb]);

	useEffect(() => {
		if (isVisible) {
			pan.selectAll('.card')
				.style('opacity', function (d, i) { return i === cardInd ? 1 : 0.3; });

			d3.select('#MissedPaymentsSVG')
				.style('opacity', 1);
			scrollVis(cardInd);
		} else {
			pan.selectAll('.card')
				.style('opacity', 0.4);

			d3.select('#MissedPaymentsSVG')
				.style('opacity', 0.4);
		}
		set_graphic(999)
	}, [isVisible, cardInd, width, height, data, filter_val, filter_Round, filter_Education, filter_RDD]);

	return <div id='MissedPayments' className="section" style={{ width: `${width}`, height: `${((height + 120) * 5) + 400}px` }}>
		<div id='graphic' className={section} style={{ zIndex: graphicFilter }}>
			<div className="card" >
				<div className="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Duis facilisis suscipit dui accumsan mattis.
				</div>
			</div>
			<div className="card" >
				<div className="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Duis facilisis suscipit dui accumsan mattis.
				</div>
			</div>
			<div className="card" >
				<div className="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Duis facilisis suscipit dui accumsan mattis.
				</div>
			</div>
			<div className="card" >
				<div className="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Duis facilisis suscipit dui accumsan mattis.
				</div>
			</div>
		</div>
		<div id='vis' style={{ height: height + 120 }}>
			<svg width={width} height={height + 20} >
				<g id='MissedPaymentsSVG' />
			</svg>
			<div id="filter" style={{ gridTemplateColumns: 'repeat(1, 1fr)', height: openFilter, width: width }}>
				<span className="close" onClick={() => { set_openFilter('0vh'); set_graphic(999) }}>&times;</span>
				<AreaEduFilter set_filterAreaEdu={set_filterComb} value={filter_Comb} />
				{/* <filter.RoundFilter set_filter={set_filterRound} value={filter_Round} /> */}
				{/* <filter.RDDFilter set_filter={set_filterRDD} value={filter_RDD} /> */}
			</div>
			<button className='Filter_Button' onClick={() => {
				if (openFilter == '0vh') {
					set_openFilter('30vh'); set_graphic(-1)
				} else {
					set_openFilter('0vh'); set_graphic(999)
				}
			}}>Filters</button>
		</div>
	</div>
}

export default MissedPayments;