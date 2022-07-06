import './App.css';
import Header from './components/Header';
import SideBar from './components/SideBar';

export default function App() {
  return (
    <div>
      <Header/>
      <SideBar/>
      <h1>Welcome to Beaver Development!</h1>
      <h3>Please Navigate using the top ribbon</h3>
      <h3>Please See the Side Menu for project group info</h3>
    </div>
  );
}
