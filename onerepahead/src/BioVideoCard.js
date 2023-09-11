import './stylesheets/VideoCard.css'
import { useState } from 'react';

const BioVideoCard = ({topic = "", src=""}) => {
    return (
            <div className="video-card">
                <video className="video" src={src} autoPlay loop muted/>
                <div className='content'>{topic}</div>
            </div>
        
    )
}

export default BioVideoCard;