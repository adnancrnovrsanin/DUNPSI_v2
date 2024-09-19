export interface Rating {
  id: string;
  projectManagerId: string;
  requirementId: string;
  ratingValue: number;
  comment: string;
  dateTimeRated: Date;
}

export interface RatingDto {
  id: string;
  projectManagerId: string;
  ratingValue: number;
  comment: string;
  dateTimeRated: string;
}

export interface CreateRatingRequest {
  projectManagerId: string;
  requirementId: string;
  ratingValue: number;
  comment: string;
}
