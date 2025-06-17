import { Link } from 'react-router-dom';


function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to My Ecommerce Apsp</h1>
      <p>Explore our products or check your <Link to="/netflix-mail">Netflix Temporary Emails</Link>.</p>
    </div>
  );
}

export default Home;