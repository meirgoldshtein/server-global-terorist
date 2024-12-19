import { Schema, model } from 'mongoose';

export interface IGroupSumData {
    name: string;
    totalCasualties: number;
    totalAttackes: number
}

interface IRegionData {
    name: string;
    groupsSumData: IGroupSumData[];
    sumOfAttackes: number;
    sumOfCasualties: number;
    
}
    
export interface IRegion  {
    name: string;
    events: Schema.Types.ObjectId[];
    groupsSumData: IGroupSumData[];
    sumOfAttackes: number;
    sumOfCasualties: number;
}

const regionAnaliticsSchema = new Schema<IRegion>({
    name: {
        type: String,
        required: [true, "Region name is required"],
        unique: true,
        index: true
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Attack' }],
    groupsSumData: [{ 
        name: { type: String, required: true },
        totalCasualties: { type: Number, required: true }
    }],
    sumOfAttackes: { type: Number, default: 0 },
    sumOfCasualties: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'regionsAnalitics'
});

export const RegionAnaliticsModel = model<IRegion>('RegionAnalitics', regionAnaliticsSchema);
export default RegionAnaliticsModel;