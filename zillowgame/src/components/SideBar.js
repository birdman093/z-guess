import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import beaver from './WinkyBeaverJPG.jpg';

export default props => {
  return (
    <Menu overflow = "hidden">
      <div>
          <h1 id = "menu-item">Beavers Try to Beat the Zestimate!</h1>
          <img src = {beaver} width ="100" height = "100" alt ="Beaver Pic--TBD"></img>
      </div>
      <a>Beat the Zestimate!</a>
      <></>
    </Menu>
  );
};