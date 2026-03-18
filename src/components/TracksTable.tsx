import type { Track } from "../types/track";

type TracksTableProps = {
  tracks: Track[];
};

export function TracksTable({ tracks }: TracksTableProps) {
  return (
    <section className="tracks-section">
      <div className="track-cards-container">
        {tracks.map((track) => {
          const cover =
            track.album?.cover_medium ||
            track.album?.cover_small ||
            track.album?.cover_big ||
            "";

          return (
            <div key={track.id} className="track-card">
              <div className="track-card-cover">
                {cover ? (
                  <img
                    src={cover}
                    alt={`Cover de ${track.title}`}
                    className="track-cover-img"
                  />
                ) : (
                  <div className="track-cover-placeholder">N/A</div>
                )}
              </div>
              <div className="track-card-info">
                <h3 className="track-title">{track.title}</h3>
                <p className="track-artist">{track.artist.name}</p>
                <a
                  href={track.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-link"
                >
                  Ecouter
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
