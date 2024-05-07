import {Internship} from "./internship.model"

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  internships: Internship[];
  userId: string;
  // Assuming InternshipModel is another interface representing internships
}
