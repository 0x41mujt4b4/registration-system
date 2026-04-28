export interface IStudent {
  id?: string;
  student_number?: number;
  receiptNumber?: number;
  name: string;
  registration_date?: string;
  session?: string;
  course?: string;
  level?: string;
  time?: string;
  fees_type?: string;
  amount?: number;
  payment_date?: string;
}

export interface ICourse {
  id?: string;
  student_id: string;
  course_name: string;
  course_level: string;
  session_type: string;
  session_time: string;
}

export interface IFees {
  id?: string;
  student_id: string;
  fees_type: string;
  amount: number;
  payment_date?: string;
  date?: string;
}

export interface IUser {
  id?: string;
  username: string;
  password?: string;
  role?: string;
}

export interface IRegistrationOptions {
  sessionOptions: string[];
  courseOptions: string[];
  levelOptions: string[];
  timeOptions: string[];
  feesTypeOptions: string[];
  defaultFeesAmount: number;
}
