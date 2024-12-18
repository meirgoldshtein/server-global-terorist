import { Schema, model } from 'mongoose';

export interface IYear {
    year_num: Number;
    events: Schema.Types.ObjectId[];
}

const regionSchema = new Schema<IYear>({
    year_num: {
        type: Number,
        required: [true, "Year number is required"],
        unique: true,
        index: true
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Attack' }]
}, {
    timestamps: true,
    collection: 'years'
});

export const YearModel = model<IYear>('Year', regionSchema);
export default YearModel;