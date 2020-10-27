import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { max } from 'd3'
import * as helper from './helperFunctions'

interface P {
    filter_Education: string
    filter_RDD: string
    filter_Round: number
    filter_val: string
    width: number
    height: number
    cardInd: number
    data: RootReducerState['raw_data']
}

const ordering: Record<string, number> = {
    "Extremely effective": 1,
    "Mostly effective": 2,
    "Moderately effective": 3,
    'Mostly ineffective': 4,
    "Not effective at all": 5,
}

const EduBucket: Record<string, number[]> = {
    'Dropped out Before Matric': [1, 2],
    'Matric': [3],
    'More than Matric': [4, 5, 6, 7, 8, 9]
}

function TestShowLockEffect({ filter_Education, filter_RDD, filter_Round, filter_val, width, height, cardInd, data }: P) {

    const margin = { top: 40, right: 20, bottom: 20, left: 45 }
    const filter_Income = 'F0'
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    function showLock() {

        let LowerLimit: number = 0;
        let UpperLimit: number = Number.MAX_VALUE;

        let q_key = "lt_11"
        let n = 0;
        const LockEffect = Object.values(data)
            .reduce((agg: Record<string, number>, curr: any) => {
                (curr.Round == 1) ? q_key = "lt_11" : q_key = "s7_2";
                if (curr[q_key] !== undefined && curr['Round'] == filter_Round && (filter_RDD !== "None" ? curr.prefix == filter_RDD : true)) {
                    if ((filter_val !== "Overall" ? curr.lt_1 === filter_val : true)
                        && (filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {

                        if (curr['i_6'] !== undefined && curr['i_6'] > LowerLimit
                            && curr['i_6'] <= UpperLimit) {

                            agg[curr[q_key]] = (agg[curr[q_key]] || 0) + 1

                            n += 1
                        }
                    }
                }
                return agg
            }, {})

        const tooltipLockEffect: Record<string, Record<string, string>> = {}
        Object.keys(LockEffect).forEach(e => {
            tooltipLockEffect[e] = {
                'Value': (100 * LockEffect[e] / n).toFixed(2) + '%',
                'Count': String(LockEffect[e]),
            };
        })

        Object.keys(LockEffect).forEach((e) => LockEffect[e] = LockEffect[e] / n * 100)

        const order_by_ordering = ([k1,]: [string, any], [k2,]: [string, any]) => ordering[k2] - ordering[k1]
        const passedData = Object.entries(LockEffect).sort(order_by_ordering)
        const [linearScale, bandScale] = helper.generateAxis(Object.keys(ordering), [0, Math.max(50, Number(max(Object.values(LockEffect))))], [0, innerWidth], [innerHeight, 0])
        const xLockEffectAxis = d3.axisBottom<any>(bandScale)
        const yLockEffectAxis = d3.axisLeft<any>(linearScale)

        const g = d3.select('#MissedPaymentsSVG')

        helper.generateElements([], 'BarFoodGroupU', g)
        helper.generateElements([], 'BarFoodGroup', g)
        g.selectAll('.legendCircle')
            .data([])
            .join(
                enter => enter,
                update => update,
                exit => exit
                    .transition().duration(650)
                    .attr('r', 0)
                    .remove(),
            )
        helper.generateElements([], 'legend', g)

        const t = g.transition().duration(650);

        bandScale.padding(0.2)

        helper.generateVertBars(passedData, 'BarGraph', g, linearScale)

        g.selectAll('.BarGraph')
            .call(s => s.transition(t)
                .attr('width', bandScale.bandwidth())
                .attr('x', (d: any) => bandScale(d[0]))
                .attr('y', (d: any) => linearScale(d[1]))
                .attr('height', (d: any) => Math.max(0, linearScale(linearScale.domain()[1] - d[1])))
				.delay((d, i) => (i * 60)))

        helper.highlightVertBar({
            selection: g, bandScale: bandScale, linearScale: linearScale,
            className: 'BarGraph', margin: margin,
            tooltipTable: tooltipLockEffect
        })



        let plotTitle = "Vertical Bar Chart"

        const yLabel = 'Percentage (%)'

        helper.plotTitle(g, innerWidth, plotTitle)
        helper.showXAxis(xLockEffectAxis, g)
        helper.showYAxis(yLockEffectAxis, g, innerHeight, innerWidth, yLabel, margin)

        g.transition().duration(650)
            .attr('transform', `translate(${margin.left},${margin.top})`)
    };

    let activeIndex = 0;
    let lastIndex = -1;

    const scrollVis = (index: number) => {

        const g = d3.select('#MissedPaymentsSVG')

        // helper.createAxis(g, innerHeight)
        activeIndex = index;
        const sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        const scrolledSections = [activeIndex]

        scrolledSections.forEach(function (i) {
            showLock();
        });
        lastIndex = activeIndex;

        // (window.matchMedia("(max-width: 767px)").matches) ?
        // 	set_openFilter('0vh') : set_openFilter('auto');
    };
    scrollVis(cardInd);

    // const pan = d3.select('.' + section)

    // useEffect(() => {
    // 	set_filter('Overall')
    // 	set_filterIncome('F0')
    // 	set_filterEducation('None')
    // 	if (filter_Comb != 'None') {

    // 		if ((filter_Comb == 'Rural') || (filter_Comb == 'Urban')) {
    // 			set_filter(filter_Comb)
    // 		}
    // 		else if ((filter_Comb == 'F1') || (filter_Comb == 'F2')) {
    // 			set_filterIncome(filter_Comb)
    // 		}
    // 		else {
    // 			set_filterEducation(filter_Comb)
    // 		}
    // 	}
    // }, [filter_Comb]);

    // useEffect(() => {

    // 	if (isVisible) {
    // 		pan.selectAll('.card')
    // 			.style('opacity', function (d, i) { return i === cardInd ? 1 : 0.3; });

    // 		d3.select('#MissedPaymentsSVG')
    // 			.style('opacity', 1);
    // 		scrollVis(cardInd);
    // 	} else {
    // 		pan.selectAll('.card')
    // 			.style('opacity', 0.4);

    // 		d3.select('#MissedPaymentsSVG')
    // 			.style('opacity', 0.4);
    // 	}
    // 	set_graphic(999)
    // }, [isVisible, cardInd, data, width, height, filter_val, filter_Round, filter_Income, filter_Education, filter_RDD]);
    // (height/0.72) * 2}px`
    // return <div id='LockEffect' className="section" style={{ width: `${width}`, height: `${((height + 120) * 2) + 100}px` }}>
    // 	<div id='graphic' className={section} style={{ zIndex: graphicFilter }}>
    // 		<div className="card" >
    // 			<div className="content">
    // 				LOCKDOWN EFFECTIVENESS<br /><br />Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    // 				Duis facilisis suscipit dui accumsan mattis.
    // 			</div>
    // 		</div>
    // 	</div>
    // 	<div id='vis' style={{ height: height + 120 }}>
    // 		<svg width={width} height={height + 20} >
    // 			<g id="MissedPaymentsSVG" />
    // 		</svg>
    // 		<div id="filter" style={{ gridTemplateColumns: 'repeat(2, 1fr)', height: openFilter, width: width }}>
    // 			<span className="close" onClick={() => { set_openFilter('0vh'); set_graphic(999) }}>&times;</span>
    // 			<AreaIncEduFilter set_filterAreaIncEdu={set_filterComb} value={filter_Comb} />
    // 			<filter.RoundFilter set_filter={set_filterRound} value={filter_Round} />
    // 			{/* <filter.RDDFilter set_filter={set_filterRDD} value={filter_RDD} /> */}
    // 		</div>
    // 		<button className='Filter_Button' onClick={() => {
    // 			if (openFilter == '0vh') {
    // 				set_openFilter('30vh'); set_graphic(-1)
    // 			} else {
    // 				set_openFilter('0vh'); set_graphic(999)
    // 			}
    // 		}}>Filters</button>
    // 	</div>
    // </div>
}

export default TestShowLockEffect;