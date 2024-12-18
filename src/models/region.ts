import { Schema, model } from 'mongoose';

export interface IRegion {
    name: string;
    events: Schema.Types.ObjectId[];
}

const regionSchema = new Schema<IRegion>({
    name: {
        type: String,
        required: [true, "Region name is required"],
        unique: true,
        index: true
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Attack' }]
}, {
    timestamps: true,
    collection: 'regions'
});

export const RegionModel = model<IRegion>('Region', regionSchema);
export default RegionModel;