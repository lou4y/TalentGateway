export interface Internship {
  intershipId: number;
  intershipTitle: string;
  intershipCompany: string;
  intershipDescription: string;
  intershipResponsibilities: string;
  intershipQualifications: string;
  intershipSkills: string;
  intershipLocation: string;
  intershipDuration: string;
  intershippostedDate: Date;
  intershipStartDate: Date;
  intershipType: string; // Assuming InternshipType is a string enum in the backend
  categoryId: number; // Add categoryId property
  userId: string; // Add userId property
  // Additional properties if needed
}
