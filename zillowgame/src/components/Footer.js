import React, {useState} from 'react';

import './Footer.css';
import '../index.css';

function Footer() {
    const [isOn, setIsOn] = useState(false);

    const handleClick = () => {
        let cs = getComputedStyle(document.querySelector(':root'));
        let bg_color; let text_color; let header_color; let box_color; let github_icon;
        if (isOn){
            bg_color = cs.getPropertyValue('--dark-mode-bg');
            text_color = cs.getPropertyValue('--dark-mode-text');
            header_color = cs.getPropertyValue('--dark-mode-header');
            box_color = cs.getPropertyValue('--dark-mode-box');
            github_icon = cs.getPropertyValue('--dark-mode-gh-icon');
        } 
        else 
        {
            bg_color = cs.getPropertyValue('--light-mode-bg');
            text_color = cs.getPropertyValue('--light-mode-text');
            header_color = cs.getPropertyValue('--light-mode-header');
            box_color = cs.getPropertyValue('--light-mode-box');
            github_icon = cs.getPropertyValue('--light-mode-gh-icon');
        }
        document.documentElement.style.setProperty('--bg-color', bg_color);
        document.documentElement.style.setProperty('--text-color', text_color);
        document.documentElement.style.setProperty('--header-bg-color', header_color);
        document.documentElement.style.setProperty('--box-color', box_color);
        document.documentElement.style.setProperty('--github-icon', github_icon);
        
        const gitHubIcon = document.getElementById("github-icon-home");
        if (gitHubIcon)
        {
            gitHubIcon.src = github_icon;
        }
        
        setIsOn(!isOn);
    }

    return (
        <footer className="footer">
            <p className="rights">© 2023 Z-Guess. All Rights Reserved.</p>
            <div className="switch-container">
                <label className="switch-label">Light Mode</label>
                <label className="switch">
                    <input type="checkbox"  onClick={handleClick}></input>
                    <span className="slider round"></span>
                </label>
            </div>
        </footer>
    );
}

export default Footer;
