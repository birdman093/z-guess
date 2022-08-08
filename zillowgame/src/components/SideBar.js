import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import beaver from './WinkyBeaverJPG.jpg';
import ReactDOM from "react-dom";

const props = () => {
  return (
    <Menu>
      <h2 id = "menu-item">Beavers Try to Beat the Zestimate!</h2>
      <img src = {beaver} width ="100" height = "100" alt ="Beaver Pic--TBD"></img>
      <h3 className="menu-item">Steps to Beating the Zestimate!</h3>
      <ol className="menu-item">
        <li>Login Using Accounts Page.  DB Admin must add you to the system.</li>
        <li>Use Display Properties to view all your properties</li>
        <li>Add Properties by Zillow link and create a name to remember the property</li>
        <li>Make a Guess on the sell price for the property</li>
        <li>Watch your score update based on our proprietary scoring system when it sells</li>
        <li>Make a spotify playlist by inserting 5 songs to keep you entertained!</li>
      </ol>
      <></>
    </Menu>
  );
};

export default props;