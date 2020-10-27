import React, { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import Loading from 'components/Header/Loading'
import HeaderPort from 'components/Header/HeaderPort'
import About from 'pages/About'
import './style.css'

type P = {
	children: React.ReactNode;
};
const MainComponent: React.FunctionComponent<P> = ({ children }) => {

	const [openNav, set_openNav] = useState('25vh')
	const [NavBName, set_NavBName] = useState('Navigation')
	const [y, setY] = useState(0)

	const navH = '70px'
	useEffect(() => {
		if (window.matchMedia("(max-width: 767px)").matches) {
			set_openNav('0vh')
		}
		else {
			set_openNav(navH)
		}
		window.onscroll = () => setY(window.pageYOffset);

	}, [])
	useEffect(() => {
		window.onscroll = () => setY(window.pageYOffset);

		if (!window.matchMedia("(max-width: 767px)").matches) {
			set_openNav(navH)
		}
		window.onresize = () => {
			if (window.matchMedia("(max-width: 767px)").matches) {
				set_openNav('0vh')
				set_NavBName('Navigation')
			}
			else {
				set_openNav(navH)
			}
		}
	})

	return <>
		<div id='home' className="port-main">
			<HeaderPort y={y} openNav={openNav} set_openNav={set_openNav} NavBName={NavBName} set_NavBName={set_NavBName} />
			{children}
		</div>
	</>
};

export default MainComponent