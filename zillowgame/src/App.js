import './App.css';
import Header from './components/Header';
import SideBar from './components/SideBar';

export default function App() {
  return (
    <div>
      <Header/>
      <SideBar/>
      <h1>Beat the Zestimate!</h1>
      <h3>Please Navigate using the top ribbon</h3>
      <h3>Please See the Side Menu for user instructions</h3>
    </div>
  );
}
