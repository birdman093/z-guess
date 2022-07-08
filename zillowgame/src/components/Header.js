import { Link } from 'react-router-dom';
import "../Header.css";

// Creates and returns title and link to a page with formatting.
const HeaderLink = ({ page }) => {
    let title;
    page === ""? title = "Home": title = page.charAt(0).toUpperCase() + page.slice(1);
    return <Link to={`/${page}`} className='headerlink-title'>{title}</Link>;
};

// Header bar to provide website navigation on every page.
const Header = () => {
    return (
      <div className='header'>
          <HeaderLink page='' />
          <HeaderLink page='AptOwners' />
      </div>
    );
  };
  
  export default Header;