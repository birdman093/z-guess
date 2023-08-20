import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import beaver from '../assets/WinkyBeaverJPG.jpg';

const props = () => {
  return (
    <Menu>
      <h2 id = "menu-item">Beavers Try to Beat the Zestimate!</h2>
      <img src = {beaver} width ="100" height = "100" alt ="Beaver Pic--TBD"></img>
      <h3 className="menu-item">Steps to Beating the Zestimate!</h3>
      <ol className="menu-item">
        <li>Account Login: Login to account. DB Admin must add you to the system.</li>
        <li>Display Properties: View your properties</li>
        <li>Add Properties:  Add by link and name</li>
        <li>Make Guesses: Guess a selling price</li>
        <li>Get a Score: Watch your score change based on our proprietary scoring system when it sells</li>
        <li>Scoring: Get Points if a guess was entered, no points if no guess was entered.</li>
        <li>Microservice Plugin: Make a spotify playlist by inserting 5 songs to keep you entertained!</li>
      </ol>
      <></>
    </Menu>
  );
};

export default props;