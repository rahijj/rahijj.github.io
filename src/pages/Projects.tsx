import React, { Children, useState } from 'react'
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {

    return (
        <div id="projects" className="projects">
            <div className='about-title'>
                <div className="react-reveal" style={{ opacity: "1" }}>
                    <span style={{ animationDuration: "1000ms" }}>P</span>
                    <span style={{ animationDuration: "1200ms" }}>r</span>
                    <span style={{ animationDuration: "1400ms" }}>o</span>
                    <span style={{ animationDuration: "1600ms" }}>j</span>
                    <span style={{ animationDuration: "1800ms" }}>e</span>
                    <span style={{ animationDuration: "2000ms" }}>c</span>
                    <span style={{ animationDuration: "2200ms" }}>t</span>
                    <span style={{ animationDuration: "2400ms" }}>s</span>
                    {/* <hr /> */}
                </div>
                <div className="proj-list react-reveal-ani" >
                    <div className='proj'>
                        <div className="center">
                            <img src={process.env.PUBLIC_URL + '/images/cerp-logo.png'}></img>
                            <h3>Economic Vulnerability Assessment</h3>
                        </div>

                        <div className="descrip">
                            The Economic Vulnerability Assessment is a series of phone surveys conducted
                            by the Centre for Economic Research in Pakistan which examines the economic impact of COVID-19
                            on households in Punjab. I am a part of the research team responsible for the analysis, and I was responsible
                            for developing a scrollable dashboard which walks through some of the findings from the study,
                            and enables exploration of the data by providing filters for each of its figures. I used the python notebook
                            environment for the exploratory analysis, and then the <b>D3.js</b> library in JavaScript for the visualisations
                            in the dashboard.<br></br>
                            <a target="_blank" href="https://drive.google.com/file/d/1UYyxrtIZAeW80sdcAeM7J-hiw-EubkhX/preview" >
                                <b>Click here for link to official Dashboard.</b>
                            </a><br></br>
                            <Link to="/scroll-dash">
                                <b >Click here for D3.js Demo.</b>
                            </Link>
                        </div>
                    </div>
                    <div className='proj'>
                        <div className="center">
                            <img src={process.env.PUBLIC_URL + '/images/twittSent.jpeg'}></img>
                            <h3>Twitter Sentiment Analysis</h3>
                        </div>
                        <div className="descrip">
                            One of the most popular communication tools today includes microblogging. Thousands
                            of gigabytes of data is available on the internet, with users sharing their opinions on all
                            aspects of their lives. This project focuses on the platform Twitter and aims to perform sentiment
                            analysis on its tweets related to the current COVID-19 situation.&nbsp;
                            <a target="_blank" href="https://drive.google.com/file/d/1UYyxrtIZAeW80sdcAeM7J-hiw-EubkhX/preview" >
                                <b>Click here for full report.</b>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
            {/* <div className="about-content">
                <div className='pdf'>
                    <iframe src="https://drive.google.com/file/d/1UYyxrtIZAeW80sdcAeM7J-hiw-EubkhX/preview" style={{ border: "None" }}></iframe>
                </div>
            </div> */}
        </div >
    )
}
export default Projects
