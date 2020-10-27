import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import HeaderTop from './HeaderTop';

interface P {
	y: number
	VisibleInd: number,
	SectionInd: Record<string, number>,
	openNav: string,
	set_openNav: Function,
	NavBName: string,
	set_NavBName: Function
}

const HeaderDashBoard: React.FC<P> = ({ y, VisibleInd, SectionInd, openNav, set_openNav, NavBName, set_NavBName }) => {

	const [stickClass, set_NavSticky] = useState('topnav-container')
	const [sticky, set_Sticky] = useState(Number.MAX_VALUE)

	useEffect(() => {
		const nav = document.getElementById('topnav-stick')
		//@ts-ignore
		set_Sticky(nav.offsetTop)
	}, [])

	useEffect(() => {
		if (!window.matchMedia("(max-width: 767px)").matches) {
			if (y >= sticky) {
				set_NavSticky("topnav-container-sticky")
			} else {
				set_NavSticky("topnav-container");
			}
		}
	})

	return <div id={stickClass} className="header">
		<HeaderTop />
		<div id='topnav-stick' className={stickClass}>
			<div className="topnav" style={{ height: openNav }}>
				<Link to="/"> Home</Link>
				<a className={String(VisibleInd === SectionInd['Income'])} href="#Income">Line Charts</a>
				<a className={String(VisibleInd === SectionInd['MissedPayments'])} href="#MissedPayments">Bar Charts</a>
			</div>
		</div>
		<div id={NavBName} className='Nav_Button' onClick={() => {
			if (openNav == '0vh') { set_openNav('20vh'); set_NavBName('Close') }
			else { set_openNav('0vh'); set_NavBName('Navigation') }
		}}>	<div className='Burger'></div>
			<div className='Burger2'></div>
            <div className='Burger3'></div>
		</div>
	</div>

}
export default HeaderDashBoard
