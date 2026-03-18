import { Presentation } from "./components/Presentation";
import { TracksTable } from "./components/TracksTable";
import { useTopTracks } from "./hooks/useTopTracks";
import "./App.css";

function App() {
  const { tracks, error } = useTopTracks(10);

  return (
    <main className="page">
      <Presentation
        title="Top 10 Musiques"
        description="Decouvre les morceaux les plus populaires du moment, avec leur cover."
      />

      {error && <p className="error">{error}</p>}

      <TracksTable tracks={tracks} />
    </main>
  );
}

export default App;