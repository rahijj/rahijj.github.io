import React, { useState } from 'react'

const HeaderTop: React.FC = () => {

    return <div className="logo-header-logo">
        <div className='cerpHeader'  >
            <img src={process.env.PUBLIC_URL + '/images/rahij.jpg'} alt="MISSING JPG" />
            <div className="navbar-brand">
                <h1>Rahij Gillani</h1>
                <div className="header-buttons">
                    <ul className='header-list'>
                        <li>
                            <a>MEng, Systems Design Engineering</a>
                            {/* <img src="https://upload.wikimedia.org/wikipedia/en/6/6e/University_of_Waterloo_seal.svg" /> */}
                        </li>
                        <li className="divider">|</li>
                        <li>
                            <a>BS, Computer Science</a>
                            {/* <img src="https://or.lums.edu.pk/sites/default/files/styles/full_width/public/default_images/lums_logo_0.gif?itok=2MvUWtw_" /> */}
                        </li>
                    </ul>
                </div>
            </div>
            <div className='react-logo-main-cont'>
                <p className="title-react-logo">Made using React</p>
                <div className="container-react-logo">
                    <span className="react-logo">
                        <span className="nucleo"></span>
                    </span>

                </div>
            </div>
        </div>
    </div>
}
export default HeaderTop
