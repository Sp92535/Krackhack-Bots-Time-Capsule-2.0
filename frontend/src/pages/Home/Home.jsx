import Navbar from "../../components/Navbar";
import "./Home.css";

const Home = () => {
  return (<>
    <Navbar />

    <div className="home-container">
      <h1>Welcome to Your Time Capsule Dashboard</h1>
      <p>Manage your personal time capsules here.</p>
    </div>
    </>
  );
};

export default Home;
