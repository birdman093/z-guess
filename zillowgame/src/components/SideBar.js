import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import beaver from './WinkyBeaverJPG.jpg';

export default props => {
  return (
    <Menu>
      <h2 id = "menu-item">Beavers Try to Beat the Zestimate!</h2>
      <img src = {beaver} width ="100" height = "100" alt ="Beaver Pic--TBD"></img>
      <a className="menu-item">Steps to Beating the Zestimate!</a>
      <ol className="menu-item">
        <li>Login Using Accounts Page.  DB Admin must add you to the system.</li>
        <li>Use Display Properties to view all your properties</li>
        <li>Add Properties by inputting property data. Use a unique property ID!</li>
        <li>Make a Guess on the sell price for the property</li>
      </ol>
      <a className="menu-item" >Future Developments</a>
      <ol className="menu-item">
        <li>Creating User Log-Ins</li>
        <li>Additional methods of inputs using Zillow</li>
        <li>Auto-Population of sell price</li>
        <li>Locking-in property guesses</li>
      </ol>
      <></>
    </Menu>
  );
};