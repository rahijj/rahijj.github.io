import React, { Children, useState } from 'react'
import MainComp from 'pages/port-main/index'

const Resume: React.FC = () => {

    return (
        <MainComp>
            <div className="about-me">
                <div className='about-title'>
                    <h1>
                        <div className="react-reveal" style={{ opacity: "1" }}>
                            <span style={{ animationDuration: "1000ms" }}>R</span>
                            <span style={{ animationDuration: "1260ms" }}>e</span>
                            <span style={{ animationDuration: "1410ms" }}>s</span>
                            <span style={{ animationDuration: "1670ms" }}>u</span>
                            <span style={{ animationDuration: "1820ms" }}>m</span>
                            <span style={{ animationDuration: "2082ms" }}>e</span>
                        </div>
                    </h1>

                </div>
                <div className="about-content">
                    <div className='holds-the-iframe'>
                        <iframe src="https://drive.google.com/file/d/1UYyxrtIZAeW80sdcAeM7J-hiw-EubkhX/preview" style={{ border: "None" }}></iframe>
                    </div>

                </div>
            </div >
        </MainComp>
    )
}
export default Resume
