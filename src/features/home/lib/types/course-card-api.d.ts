export interface CourseApiItem {
  id: number;
  title: string;
  instructorName: string;
  shortDescription: string;
  imageUrl:string;
  price: number;
  discountPrice:number|null;
  courseHours:number;
  numberOfLessons:number;
  numberOfStudents:number;
  level:string;
  rating:number;
  localizedPrices: Array<{
    id:number,
    countryCode:string,
    currencyCode:string,
    price:number,
    discountPrice:number|null;

  }>;
}


export interface CoursesApiResponse {
  items: CourseApiItem[];
  page:number;
  pageSize:number;
  totalCount:number;
  totalPages:number;
  hasNextPage:boolean;
  hasPreviousPage:boolean;

}

/* ─── Query params sent to the API ─── */
export interface CoursesQueryParams {
  page: number;
  pageSize: number;
  Level?:string;
  MinRating?:number;
  IsFree?:boolean;
  SearchTerm?:string;
}