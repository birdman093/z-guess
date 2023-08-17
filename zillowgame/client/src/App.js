import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import {UserProvider} from './components/UserProvider';

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