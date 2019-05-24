import React from 'react';
import './Logo.css';
import Tilt from 'react-tilt';
import brain from './brain.png';

const Logo = ()=> {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt" options={{ max : 55 }} style={{ height: 100, width: 100 }} >
            <span role="img" aria-label="Snowman" className="Tilt-inner"> <img style={{paddingTop: '5px'}} alt="brain" src={brain}></img> </span>            </Tilt>
        </div>
    );
}

export default Logo;