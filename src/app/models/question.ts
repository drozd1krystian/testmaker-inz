export interface Question {
  id?:string;
  question?: string;
  answers?: String[];
  correct?: string;
  date?: Date;
}