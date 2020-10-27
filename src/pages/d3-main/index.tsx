import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import { getRawData } from 'actions'
import Income from 'components/D3Panels/Chapter1/Income'
import scroller from 'pages/d3-main/scroller'
import './style.css'
import MissedPayments from 'components/D3Panels/Chapter1/MissedPayments'
import HeaderDashBoard from 'components/Header/HeaderDashBoard'
import Loading from 'components/Header/Loading'

type P = {
	raw_data: RootReducerState['raw_data'];
	loading: RootReducerState['loading'];
	getRaw: () => void;
};
const MainComponent: React.FunctionComponent<P> = ({ loading, getRaw, raw_data }) => {

	const [openNav, set_openNav] = useState('25vh')
	const [NavBName, set_NavBName] = useState('Navigation')
	// This Height and width paramerters passed to the components is the
	// height and width we want our svg graph to be.
	const [height, setHeight] = useState(window.innerHeight - 210)
	const [width, setWidth] = useState(window.innerWidth * 0.75)
	const [y, setY] = useState(250)
	const [VisibleInd, setVisibleInd] = useState(-1)
	const [orient, setOrient] = useState('0')
	const section = ['Section_0', 'Section_1']
	const [cardInd, setCardInd] = useState([-1, -1, -1]);

	//SectionInd MUST be in same Order as Order of Sections in d3-main div below
	const SectionInd: Record<string, number> = {
		'Income': 0,
		'MissedPayments': 0,
	}

	let n = 0
	Object.keys(SectionInd).forEach(e => {
		SectionInd[e] = n
		n += 1
	})

	useEffect(() => {
		getRaw()
	}, []);

	useEffect(() => {
		setY(window.pageYOffset)
		if (window.matchMedia("(max-width: 767px)").matches) {
			set_openNav('0vh')
			if (window.matchMedia("(orientation: landscape)").matches) {
				setHeight(window.innerHeight - 190)
			}
			else {
				setHeight(window.innerHeight - 190)
			}
		}
		if (window.matchMedia("(orientation: landscape)").matches) {
			setOrient('90')
		}
	}, [])
	useEffect(() => {

		if (window.matchMedia("(max-width: 767px)").matches) {
			setWidth(window.innerWidth * 0.95)
			if (window.matchMedia("(orientation: landscape)").matches) {
				if (orient != '90') {
					setHeight(window.innerHeight - 190)
					setOrient('90')
				}
			} else if (orient != '0') {
				setHeight(window.innerHeight - 190)
				setOrient('0')
			}
		} else {
			set_openNav('94px')
		}
		window.onscroll = () => setY(window.pageYOffset);
		window.onresize = () => {
			if (window.matchMedia("(max-width: 767px)").matches) {

				// compare new height to old height
				// only update at 20% change
				setWidth(window.innerWidth * 0.95)
				set_openNav('0vh')
				set_NavBName('Navigation')
				if ((window.innerHeight - (height + 190)) / (height + 190) > 0.05) {
					setHeight(window.innerHeight - 190)
				}
				else if (((height + 190) - window.innerHeight) / (height + 190) > 0.30) {
					setHeight(window.innerHeight - 190)
				}
				// setHeight(window.innerHeight * 0.7)

			} else {
				// The viewport is at least 768 pixels wide
				setWidth(window.innerWidth * 0.75)
				setHeight(window.innerHeight - 210)
			}
		}

	})

	useEffect(() => {
		const pan = d3.select('.d3-main')
		const index: number = scroller(pan, pan.selectAll('.section'), y)
		setVisibleInd(index)

		let n = 0;
		section.forEach((sec) => {
			const pan = d3.select('.' + sec)
			let temp = cardInd
			temp[n] = scroller(pan, pan.selectAll('.card'), y)
			setCardInd(temp)
			n += 1;
		})
	});

	return (
		<div className="d3-main">
			<HeaderDashBoard y={y} VisibleInd={VisibleInd} SectionInd={SectionInd} openNav={openNav} set_openNav={set_openNav} NavBName={NavBName} set_NavBName={set_NavBName} />
			<Loading loading={loading} />
			<div className='GraphsDiv' style={{ width: '100%', display: 'block' }}>
				<Income width={width} height={height} data={raw_data} cardInd={cardInd[SectionInd['Income']]} isVisible={VisibleInd === SectionInd['Income']} section={section[SectionInd['Income']]} />
				<MissedPayments width={width} height={height} data={raw_data} cardInd={cardInd[SectionInd['MissedPayments']]} isVisible={VisibleInd === SectionInd['MissedPayments']} section={section[SectionInd['MissedPayments']]} />

			</div>

		</div>
	);
};

export default connect((state: RootReducerState) => ({
	raw_data: state.raw_data,
	loading: state.loading
}), (dispatch: Function) => ({
	getRaw: () => dispatch(getRawData())
}))(MainComponent)