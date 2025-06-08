import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to My Ecommerce App</h1>
      <p>Explore our products or check your <Link to="/netflix-mail">Netflix Temporary Emails</Link>.</p>
    </div>
  );
}

export default Home;