
export type Coordinates = {
  lat: number;
  lng: number;
};

export type AccessibilityRating = {
  wheelchair: boolean;
  blind: boolean;
  elderly: boolean;
  stroller: boolean;
};

export type PlaceRating = {
  userId: string;
  stars: number;
  comment: string;
  createdAt: Date;
};

export type Place = {
  id: string;
  name: string;
  location: Coordinates;
  accessibility: AccessibilityRating & {
    ratings: PlaceRating[];
  };
  averageRating?: number;
  address?: string;
  photos?: string[];
};

export type ObstacleType = 
  | 'staircase' 
  | 'narrow_passage' 
  | 'broken_elevator' 
  | 'high_curb' 
  | 'steep_ramp'
  | 'no_tactile_paving'
  | 'other';

export type ObstacleStatus = 'unconfirmed' | 'confirmed' | 'resolved';

export type Obstacle = {
  id: string;
  userId: string;
  type: ObstacleType;
  location: Coordinates;
  description?: string;
  photoUrl?: string;
  status: ObstacleStatus;
  createdAt: Date;
  updatedAt?: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  contributions: {
    obstacles: number;
    ratings: number;
  };
};
