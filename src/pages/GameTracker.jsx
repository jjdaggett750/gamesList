import { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { List, ListItem } from "../components/ui/list";

export default function GameTracker() {
  const [games, setGames] = useState([]);
  const [game, setGame] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to add a game to the list
  const addGame = (game) => {
    setGames([...games, { name: game.name, date: new Date().toLocaleDateString() }]);
  };

  // Function to search for a game
  const searchGame = async (gameName) => {
    if (!gameName) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: 'YOUR_API_KEY',  // Replace with your API key from RAWG
          search: gameName,
        }
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Game Tracker</h1>

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
      {loading && <p>Loading...</p>}
      <List>
        {searchResults.map((result) => (
          <ListItem key={result.id}>
            <Card>
              <p className="font-semibold">{result.name}</p>
              <Button onClick={() => addGame(result)}>Add to List</Button>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* User's Game List */}
      <h2 className="text-lg font-semibold mt-6">Your Games</h2>
      <List>
        {games.map((g, index) => (
          <ListItem key={index}>
            <Card>
              <p className="font-semibold">{g.name}</p>
              <p className="text-sm text-gray-500">Played on: {g.date}</p>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
