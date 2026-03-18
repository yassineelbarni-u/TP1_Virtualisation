
export type Track = {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album?: {
    cover_small?: string;
    cover_medium?: string;
    cover_big?: string;
  };
  link: string;
  rank: number;
};
