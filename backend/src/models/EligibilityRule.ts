import mongoose, { Schema, Document } from 'mongoose';

export interface IEligibilityRule extends Document {
  schemeId: string;
  ruleName: string;
  field: 'annualIncome' | 'age' | 'category';
  operator: '<=' | '>=' | '==' | '!=';
  targetValue: any;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EligibilityRuleSchema: Schema = new Schema(
  {
    schemeId: { type: String, required: true, index: true },
    ruleName: { type: String, required: true },
    field: { type: String, required: true, enum: ['annualIncome', 'age', 'category'] },
    operator: { type: String, required: true, enum: ['<=', '>=', '==', '!='] },
    targetValue: { type: Schema.Types.Mixed, required: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IEligibilityRule>('EligibilityRule', EligibilityRuleSchema);
