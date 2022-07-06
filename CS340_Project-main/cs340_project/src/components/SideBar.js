import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import beaver from './WinkyBeaverJPG.jpg';

export default props => {
  return (
    <Menu overflow = "hidden">
      <div>
          <h1 id = "menu-item">Beaver Development Database Tables</h1>
          <img src = {beaver} width ="100" height = "100" alt ="Beaver Pic--TBD"></img>
      </div>
      <a>Final Project</a>
      <a>CS 340: Intro to Databases</a>
      <a>Group 93</a>
      <a>Russell Feathers</a>
      <a>Jonathon Shea</a>
      <a>Due Date: 03/17/22</a>
      <></>
    </Menu>
  );
};