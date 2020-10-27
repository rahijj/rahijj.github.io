import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import * as helper from '../helperFunctions'

interface P {
    filter_Education: string
    filter_RDD: string
    width: number
    height: number
    cardInd: number
    data: RootReducerState['raw_data']
}

const EduBucket: Record<string, number[]> = {
    'Dropped out Before Matric': [1, 2],
    'Matric': [3],
    'More than Matric': [4, 5, 6, 7, 8, 9]
}

function FoodClusFunc({ filter_Education, filter_RDD, width, height, cardInd, data }: P) {

    const margin = { top: 40, right: 20, bottom: 20, left: 55 }
    // const [openFilter, set_openFilter] = useState('0vh')

    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const assign: Record<string, Record<string, number>> = {
        'Urban': {
            'Round U1': 0,
            'Round U2': 0
        },
        'Rural': {
            'Round 1': 0,
            'Round 2': 0
        }
    }
    function FoodClus() {

        let Ur1 = 0;
        let Ur2 = 0;
        let Rr1 = 0;
        let Rr2 = 0;
        const Food = Object.values(data)
            .reduce((agg: Record<string, Record<string, number>>, curr: any) => {
                if (curr.fi_1 !== undefined && (filter_RDD !== "None" ? curr.prefix == filter_RDD : true)) {
                    if ((filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {

                        if (curr.Round == 1) {
                            if (curr.lt_1 == 'Urban') {
                                Ur1 += 1
                            }
                            else if (curr.lt_1 == 'Rural') {
                                Rr1 += 1
                            }
                        }
                        else {
                            if (curr.lt_1 == 'Urban') {
                                Ur2 += 1
                            }
                            else if (curr.lt_1 == 'Rural') {
                                Rr2 += 1
                            }
                        }
                        if (curr.fi_1 == 0) {

                            if (curr.Round == 1) {
                                if (curr.lt_1 == 'Urban') {
                                    agg['Urban']['Round U1'] += 1
                                }
                                else if (curr.lt_1 == 'Rural') {
                                    agg['Rural']['Round 1'] += 1
                                }
                            }
                            else if (curr.Round == 2) {
                                if (curr.lt_1 == 'Urban') {
                                    agg['Urban']['Round U2'] += 1
                                }
                                else if (curr.lt_1 == 'Rural') {
                                    agg['Rural']['Round 2'] += 1
                                }
                            }
                        }
                    }
                }
                return agg
            }, assign)

        // console.log('Food', Food, 'Rural R1:', Rr1,'Urban R1:', Ur1,'Rural R2:', Rr2,'Urban R2:', Ur2)

        let n = 0
        const tooltipFood: Record<string, Record<string, string>> = {}
        Object.keys(Food).forEach(e => {
            Object.keys(Food[e]).forEach(r => {

                if (e == 'Urban') {
                    ((r == 'Round U1')) ? n = Ur1 : n = Ur2;
                }
                if (e == 'Rural') {
                    ((r == 'Round 1')) ? n = Rr1 : n = Rr2;
                }
                tooltipFood[r] = {
                    'Value': (100 * Food[e][r] / n).toFixed(2) + '%',
                    'Count': String(Food[e][r]),
                };
                Food[e][r] = 100 * Food[e][r] / n
            });
        })
        // const order_by_ordering = ([k1,]: [string, any], [k2,]: [string, any]) => ordering[k2] - ordering[k1]
        const passedData: [string, Record<string, number>][] = Object.entries(Food)

        const [linearScale, bandScale] = helper.generateAxis(Object.keys(Food),
            [0, 40], [0, innerWidth], [innerHeight, 0])

        const xSubgroup = d3.scaleBand()
            .domain(['Round 1', 'Round 2'])
            .range([bandScale.bandwidth() * 0.05, bandScale.bandwidth() * 0.95])
            .padding(0.1);

        const xSubgroup2 = d3.scaleBand()
            .domain(['Round U1', 'Round U2'])
            .range([bandScale.bandwidth() * 0.05, bandScale.bandwidth() * 0.95])
            .padding(0.1);

        const xFoodAxis = d3.axisBottom<any>(bandScale)
        const yFoodAxis = d3.axisLeft<any>(linearScale)

        const g = d3.select('#MissedPaymentsSVG')
        const t = g.transition().duration(650);
        let legend: Record<string, string> = {}

        bandScale.padding(0)

        helper.generateElements([], 'BarGraph', g)

        if (!isNaN(Object.values(passedData[0][1])[0])) {

            g.selectAll('.gBarFood')
                .data(passedData)
                .join(
                    enter => enter.append('g')
                        .attr("transform", (d: any) => {
                            return "translate(" + bandScale(d[0]) + ",0)";
                        })
                        .attr('class', 'gBarFood'),

                    update => update.
                        attr("transform", (d: any) => {
                            return "translate(" + bandScale(d[0]) + ",0)";
                        }),
                    exit => exit
                        .remove(),
                )
                .selectAll('rect')
                .data((d: any) => {
                    let R = ['Round 1', 'Round 2']
                    if (d[0] == 'Urban') {
                        R = ['Round U1', 'Round U2']
                    }
                    return R.map((key: any) => {
                        return { key: key, value: d[1][key] };
                    });
                })
                .join(
                    enter => enter.append("rect")
                        .attr('class', (d) => {
                            if ((d.key == 'Round U1') || (d.key == 'Round U2')) {
                                return ('BarFoodGroupU')
                            }
                            else {
                                return ('BarFoodGroup')
                            }
                        })
                        .attr('id', (d) => 'BarFood' + d.key[d.key.length - 1])
                        .attr('opacity', 0.9)
                        .attr('width', (d) => {
                            if ((d.key == 'Round U1') || (d.key == 'Round U2')) {
                                return (xSubgroup2.bandwidth())
                            }
                            else {
                                return (xSubgroup.bandwidth())
                            }
                        })
                        //@ts-ignore
                        .attr('x', (d: any) => {
                            if ((d.key == 'Round U1') || (d.key == 'Round U2')) {
                                return (xSubgroup2(d.key))
                            }
                            else {
                                return (xSubgroup(d.key))
                            }
                        })
                        .attr('y', (d: any) => {
                            return (linearScale(d.value))
                        })
                        .call((s: any) => s.transition(t)
                            .attr('height', (d: any) => {
                                if (isNaN(d.value)) {
                                    return (0)
                                }
                                return (Math.max(0, linearScale(linearScale.domain()[1] - d.value)))
                            })),
                    update => update
                        .attr('width', (d) => {
                            if ((d.key == 'Round U1') || (d.key == 'Round U2')) {
                                return (xSubgroup2.bandwidth())
                            }
                            else {
                                return (xSubgroup.bandwidth())
                            }
                        })
                        //@ts-ignore
                        .attr('x', (d: any) => {
                            if ((d.key == 'Round U1') || (d.key == 'Round U2')) {
                                return (xSubgroup2(d.key))
                            }
                            else {
                                return (xSubgroup(d.key))
                            }
                        })
                        .call((s: any) => s.transition(t)
                            .attr('y', (d: any) => {
                                return (linearScale(d.value))
                            })
                            .attr('height', (d: any) => {
                                if (isNaN(d.value)) {
                                    return (0)
                                }
                                return (Math.max(0, linearScale(linearScale.domain()[1] - d.value)))
                            })
                        ),
                    exit => exit
                        .transition().duration(650)
                        .attr('height', 0)
                        .remove(),
                )
        }
        helper.highlightVertBar({
            selection: g, bandScale: xSubgroup, linearScale: linearScale,
            className: 'BarFoodGroup', margin: margin,
            tooltipTable: tooltipFood, translate: bandScale('Rural')
        })
        helper.highlightVertBar({
            selection: g, bandScale: xSubgroup2, linearScale: linearScale,
            className: 'BarFoodGroupU', margin: margin,
            tooltipTable: tooltipFood
        })

        legend = {
            'Round 1': '#242424',
            'Round 2': '#344a62',
        }

        helper.showLegend(legend, g)
        g.selectAll('.legend')
            .attr('transform', `translate(${bandScale.range()[1] - 130},${margin.top})`)

        g.attr('transform', `translate(${margin.left},${margin.top})`)

        let plotTitle = "Clustered Bar Chart"

        const yLabel = 'Percentage (%)'

        helper.plotTitle(g, innerWidth, plotTitle)
        helper.showXAxis(xFoodAxis, g)
        helper.showYAxis(yFoodAxis, g, innerHeight, innerWidth, yLabel, margin)
    };

    const activateFunctions: any = [];
    let activeIndex = 0;
    let lastIndex = -1;

    const scrollVis = (index: number) => {

        const g = d3.select('#MissedPaymentsSVG')
        helper.generateElements([['legend', 1]], 'legend', g, 'g')

        helper.createAxis(g, innerHeight)
        activeIndex = index;
        const sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        const scrolledSections = [activeIndex]

        scrolledSections.forEach(function (i) {
            FoodClus();
        });
        lastIndex = activeIndex;

        // (window.matchMedia("(max-width: 767px)").matches) ?
        //     set_openFilter('0vh') : set_openFilter('auto');
    };
    scrollVis(cardInd);

    // const pan = d3.select('.' + section)

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
    // }, [isVisible, cardInd, data, width, height, filter_Education, filter_RDD]);
    // (height/0.72) * 2}px`
    // return <div id='FoodClus' className="section" style={{ width: `${width}`, height: `${(height + 120) * 2.2}px` }}>
    // 	<div id='graphic' className={section} style={{ zIndex: graphicFilter }}>
    // 		<div className="card" >
    // 			<div className="content">
    // 				Among those households which were unable to buy essential food,
    // 				74% state that they did not have the money to do so, while 17% cite that some
    // 				items were more expensive than usual.

    // 			</div>
    // 		</div>
    // 	</div>
    // 	<div id='vis' style={{ height: height + 120 }}>
    // 		<svg width={width} height={height + 20} >
    // 			<g id="MissedPaymentsSVG" />
    // 		</svg>
    // 		<div id="filter" style={{ gridTemplateColumns: 'repeat(1, 1fr)', height: openFilter, width: width }}>
    // 			<span className="close" onClick={() => { set_openFilter('0vh'); set_graphic(999) }}>&times;</span>
    // 			<filter.EduFilter set_filter={set_filterEducation} value={filter_Education} />
    // 			{/* <filter.RDDFilter set_filter={set_filterRDD} value={filter_RDD} /> */}
    // 		</div>
    // 		<button className='Filter_Button' onClick={() => {
    // 			if (openFilter == '0vh') {
    // 				set_openFilter('20vh'); set_graphic(-1)
    // 			} else {
    // 				set_openFilter('0vh'); set_graphic(999)
    // 			}
    // 		}}>Filters</button>
    // 	</div>
    // </div>
}
export default FoodClusFunc;