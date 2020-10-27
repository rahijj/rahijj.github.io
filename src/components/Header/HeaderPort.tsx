import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import HeaderTop from './HeaderTop'

interface P {
    y: number
    openNav: string,
    set_openNav: Function,
    NavBName: string,
    set_NavBName: Function
}

const Header: React.FC<P> = ({ y, openNav, set_openNav, NavBName, set_NavBName }) => {

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
        } else {
            set_NavSticky("topnav-container");
        }
    })
    // console.log('wtf', process.env.PUBLIC_URL)
    const href = window.location.href
    // console.log('wtf2', href)
    return <div id={stickClass} className="header">
        <HeaderTop />
        <div id='topnav-stick' className={stickClass}>
            <div className="topnav" style={{ height: openNav }}>
                <Link className={String(href.includes('/rahijG'))} to="/" href="#home">
                    <img src={process.env.PUBLIC_URL + '/images/home.svg'} alt='Missing png' style={{ filter: "invert(1)", height: "20px", width: "20px", padding: "5px" }}></img>
                    Home
                </Link>
                {/* <Link className={String(href.includes('#projects'))} to="/rahijj" href="#projects" >
                    <a href="#projects">
                        <img src={home} alt='Missing png' style={{ filter: "invert(1)", height: "20px", width: "20px", padding: "5px" }}></img>
                    Projects
                    </a>
                </Link> */}
                <Link className={String(href.includes('/resume'))} to="/resume">
                    <img src={process.env.PUBLIC_URL + '/images/res.png'} alt='Missing png'></img>
                    Resume
                </Link>
                <a target="_blank" href="https://www.linkedin.com/in/rgillani/">
                    <img src={process.env.PUBLIC_URL + '/images/lIn.png'} alt='Missing png'></img>
                    LinkedIn
                </a>

                <a target="_blank" href="https://github.com/rahijj">
                    <img src={process.env.PUBLIC_URL + '/images/gHub.png'} alt='Missing png' style={{ filter: "invert(1)", height: "20px", width: "20px", padding: "5px" }}></img>
                     GitHub</a>
                <Link to="/scroll-dash"> <img src={process.env.PUBLIC_URL + '/images/d3.png'} alt='Missing png' style={{ height: "20px", width: "20px", padding: "5px" }}></img>
                    <span style={{ textTransform: 'none' }} >
                        D3.js - Demo</span></Link>

            </div>
        </div>
        <div id={NavBName} className='Nav_Button' onClick={() => {
            if (openNav == '0vh') { set_openNav('45vh'); set_NavBName('Close') }
            else { set_openNav('0vh'); set_NavBName('Navigation') }
        }}>	<div className='Burger'></div>
            <div className='Burger2'></div>
            <div className='Burger3'></div>
        </div>
    </div >

}
export default Header
