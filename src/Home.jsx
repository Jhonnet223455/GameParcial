import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/game');
  };

  return (
    <div className="App flex items-center justify-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">AimLab</h1>
        <button
          onClick={handlePlayClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-200"
        >
          Play
        </button>
      </div>
    </div>
  );
}

export default Home;
