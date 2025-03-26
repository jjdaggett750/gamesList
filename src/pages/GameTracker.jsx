import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { List, ListItem } from "../components/ui/list";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ReactStars from "react-rating-stars-component";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function GameTracker() {
  const [games, setGames] = useState([]);
  const [game, setGame] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search"); // Manage active tab (search or my games)
  const [rating, setRating] = useState(0); // Store rating

  // Function to add a game to the list with a rating
  const addGame = (game) => {
    if (rating === 0) {
      alert("Please provide a rating before adding the game.");
      return;
    }

    setGames([
      ...games,
      {
        name: game.name,
        image: game.background_image,
        date: new Date().toLocaleDateString(),
        genres: game.genres.map((genre) => genre.name),
        rating: rating, // Save the rating
      },
    ]);
    setRating(0); // Reset rating after saving the game
  };

  // Function to search for a game
  const searchGame = async (gameName) => {
    if (!gameName) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: 'a6fd16e325944652900b859abeaef1f2',  // Replace with your API key from RAWG
          search: gameName,
        }
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
    setLoading(false);
  };

  // Function to get genre counts
  const getGenreCounts = () => {
    const genreCounts = {};
    games.forEach((game) => {
      game.genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    return genreCounts;
  };

  // Prepare the data for the Pie chart
  const genreCounts = getGenreCounts();
  const genreData = {
    labels: Object.keys(genreCounts),
    datasets: [
      {
        data: Object.values(genreCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"], // You can customize these colors
        hoverBackgroundColor: ["#FF5A5F", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"],
      },
    ],
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Game Tracker</h1>

      {/* Tab navigation */}
      <div className="flex justify-center mb-4 space-x-4">
        <Button onClick={() => setActiveTab("search")} className={activeTab === "search" ? "bg-blue-500 text-white" : ""}>
          Search Games
        </Button>
        <Button onClick={() => setActiveTab("myGames")} className={activeTab === "myGames" ? "bg-blue-500 text-white" : ""}>
          My Games
        </Button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div>
          <div className="flex gap-2 mb-4">
            <Input
              value={game}
              onChange={(e) => setGame(e.target.value)}
              placeholder="Enter game name"
              onBlur={() => searchGame(game)}  // Search when the input loses focus
            />
            <Button onClick={() => searchGame(game)}>Search</Button>
          </div>

          {/* Search Results */}
          {loading && <p className="text-center">Loading...</p>}

          <List>
            {searchResults.map((result) => (
              <ListItem key={result.id}>
                <Card className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow-lg">
                  <img
                    src={result.background_image ? result.background_image : "https://via.placeholder.com/150"}
                    alt={result.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold text-lg">{result.name}</p>
                    
                    {/* Rating Component */}
                    <div className="mt-2">
                      <ReactStars
                        count={5}
                        onChange={(newRating) => setRating(newRating)}
                        size={24}
                        value={rating}
                        isHalf={false}
                        activeColor="#ffd700"
                      />
                    </div>

                    <Button onClick={() => addGame(result)} className="mt-2">Add to List</Button>
                  </div>
                </Card>
              </ListItem>
            ))}
          </List>
        </div>
      )}

      {/* My Games Tab */}
      {activeTab === "myGames" && (
        <div>
          <h2 className="text-lg font-semibold mt-6">Your Games</h2>

          {/* Pie Chart */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Game Genre Distribution</h3>
            <Pie data={genreData} />
          </div>

          {/* Game List */}
          <List>
            {games.map((g, index) => (
              <ListItem key={index}>
                <Card className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow-lg">
                  <img
                    src={g.image ? g.image : "https://via.placeholder.com/150"}
                    alt={g.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold text-lg">{g.name}</p>
                    <p className="text-sm text-gray-500">Played on: {g.date}</p>
                    <p className="text-sm text-gray-500">Genres: {g.genres.join(", ")}</p>
                    <p className="text-sm text-yellow-500">Rating: {g.rating} / 5</p> {/* Display the rating */}
                  </div>
                </Card>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}
