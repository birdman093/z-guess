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
        <li>Use DisplayProperties to view all your properties</li>
        <li>Add Properties by clicking add and input property data</li>
        <li>Guess on added property on right side of property tables</li>
      </ol>
      <a className="menu-item" >Future Developments</a>
      <ol className="menu-item">
        <li>Creating Users</li>
        <li>Input by zillow propertyID</li>
        <li>Auto-Population of sale price</li>
        <li>Locking property guesses</li>
      </ol>
      <></>
    </Menu>
  );
};