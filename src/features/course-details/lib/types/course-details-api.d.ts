export interface CourseSection {
  id: number;
  title: string;
  lecturesCount: number;
  totalTime: string;
  lectures: {
    id: number;
    title: string;
    duration: string;
  }[];
}

export interface prerequisitesAndLearningOutcomes{
  id:string;
  description:string;
  sortOrder:number;
}
export interface previewVideos{
  id:string;
  videoUrl:string;
  title:string;
  sortOrder:number;
  
}
export interface localizedPrices{
  id:string;
  countryCode:string;
  currencyCode:string;
  price:number;
  discountPrice?:number
}
export interface CourseDetailsApiResponse {
  id: string;
  title: string;
  instructorName: string;
  shortDescription:string;
  cardImageUrl:string;
  detailImageUrl:string;
  resolvedPrice?: { price: number; discountPrice?: number | null; currencyCode: string; } | null;
  level:string;
  rating: number;
  description: string;
  totalReviews:number;
  numberOfStudents?: number;
  createdAt: string;
  updatedAt: string;
  status:string;

  prerequisites: prerequisitesAndLearningOutcomes[];
  learningOutcomes: prerequisitesAndLearningOutcomes[];
  previewVideos:previewVideos[];
  localizedPrices:localizedPrices[];

}
