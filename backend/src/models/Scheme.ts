import mongoose, { Schema, Document } from 'mongoose';

export interface IScheme extends Document {
  schemeId: string; // e.g., SCH-SCHOLARSHIP-01, SCH-PENSION-01
  title: string;
  category: 'Scholarship' | 'Pension' | 'Housing' | 'Healthcare';
  description: string;
  department: string;
  maxIncomeThreshold: number;
  minAgeRequired?: number;
  benefitsAmount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SchemeSchema: Schema = new Schema(
  {
    schemeId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ['Scholarship', 'Pension', 'Housing', 'Healthcare'] },
    description: { type: String, required: true },
    department: { type: String, default: 'Social Welfare Department' },
    maxIncomeThreshold: { type: Number, required: true },
    minAgeRequired: { type: Number, default: 0 },
    benefitsAmount: { type: Number, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IScheme>('Scheme', SchemeSchema);
