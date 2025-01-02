export interface Reading {
  id: string;
  date: string;
  currentReading: number;
  previousReading: number;
  pricePerKwh: number;
  additionalCharges: AdditionalCharge[];
  totalAmount: number;
}

export interface AdditionalCharge {
  id: string;
  description: string;
  amount: number;
}

export interface CsvReading {
  date: string;
  currentReading: number;
  previousReading: number;
  pricePerKwh: number;
  totalAmount: number;
}