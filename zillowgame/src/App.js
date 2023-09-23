import './App.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import {UserProvider} from './components/UserProvider.js';

function App() {
  return (
    <>
      <UserProvider>
        <Header/>
      </UserProvider>
      <Footer/>
    </>
  );
}

export default App;