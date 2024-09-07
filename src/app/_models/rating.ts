export interface Rating {
    id: string;
    projectId: string;
    projectManagerId: string;
    developerId: string;
    ratingValue: number;
    comment: string;
    dateTimeRated: Date;
}

export interface RatingDto {
    id: string;
    projectId: string;
    projectManagerId: string;
    developerId: string;
    ratingValue: number;
    comment: string;
    dateTimeRated: string;
}