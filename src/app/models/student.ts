export interface Student {
  index: string
  name?: string;
  surname?: string;
  grades?: Grade[];
  qr?: string;
}

export interface Grade {
  id: string,
  subject?: string,
  grade?: string,
  name?:string,
  points?: string,
  date?: string,
}