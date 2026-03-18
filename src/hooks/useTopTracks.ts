import { useEffect, useState } from "react";
import type { Track } from "../types/track";

type ChartResponse = {
  data?: Track[];
};

export function useTopTracks(limit = 10) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tracks")
      .then((res) => res.json() as Promise<Track[]>)
      .then((data) => {
        setTracks(data.slice(0, limit));
      })
      .catch(() => setError("Erreur: Impossible de se connecter au serveur."));
  }, [limit]);

  return { tracks, error };
}
