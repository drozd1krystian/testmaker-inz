import { Question } from '../models/question';

export interface Student {
  index: string
  name: string;
  surname: string;
  grades?: Grade[];
  qr?: string;
  questions?: Question[]
}

export interface Grade {
  id: string,
  grade: string,
  name:string,
  points?: string,
  date?: string,
}