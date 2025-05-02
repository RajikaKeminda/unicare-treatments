import mongoose, { Schema, Document } from 'mongoose';

interface ITreatmentMapping extends Document {
  diagnosis: string;
  keywords: string[];
  treatment: string;
  medicines: string[];
}

const treatmentMappingSchema: Schema = new Schema(
  {
    diagnosis: {
      type: String,
      required: true
    },
    keywords: {
      type: [String],
      required: true
    },
    treatment: {
      type: String,
      required: true
    },
    medicines: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const TreatmentMapping = mongoose.model<ITreatmentMapping>('TreatmentMapping', treatmentMappingSchema);

export default TreatmentMapping;
