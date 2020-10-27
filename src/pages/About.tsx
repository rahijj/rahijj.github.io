import React, { useEffect, Children, useState } from 'react'
// import sent from 'Sentiment.pdf'
//@ts-ignore
import Roll from 'react-reveal/Roll'
import MainComp from 'pages/port-main/index'
import Projects from './Projects'

const About: React.FC = () => {
    // console.log('inAbout')

    return (
        <MainComp>
            <div className="about-me">
                <div className='about-title'>
                    <div className="react-reveal" style={{ opacity: "1" }}>
                        <span style={{ animationDuration: "1000ms" }}>A</span>
                        <span style={{ animationDuration: "1260ms" }}>b</span>
                        <span style={{ animationDuration: "1410ms" }}>o</span>
                        <span style={{ animationDuration: "1670ms" }}>u</span>
                        <span style={{ animationDuration: "1820ms" }}>t</span>
                        {/* <hr /> */}
                    </div>
                </div>
                <div className="about-content">
                    <p className="react-reveal">
                        Hi I'm <b>Rahij</b>, a <b>software engineer</b> from <b>Waterloo, ON. </b>
                        I'll be graduating in <b>December 2020</b> with a Masters degree in Systems Design Engineering
                        (ML specialization) from the University of Waterloo. I'm currently looking
                        for <b>full-time</b> roles in Ontario, Canada.
                    </p>
                    {/* <div className='pdf'>
                        <iframe src="https://drive.google.com/file/d/1W5AoMhlPCYM4qzSBPW7DyvysusSEXAS2/preview" style={{ border: "None" }}></iframe>
                    </div> */}
                </div>
                <Projects />
            </div >
        </MainComp>
    )
}
export default About
