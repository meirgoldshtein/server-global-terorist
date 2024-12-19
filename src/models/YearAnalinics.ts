// import { Schema, model } from 'mongoose';
// import { IGroupSumData } from './regionAnalitics';

// export interface IYearAnalinics {
//     year_num: Number;
//     events: Schema.Types.ObjectId[];
//     sumOfAttackes: number;
//     sumOfCasualties: number;
//     groupsSumData: IGroupSumData[];
//     month:{month: number, sumOfAttackes: number, sumOfCasualties: number}
// }

// const regionSchema = new Schema<IYearAnalinics>({
//     year_num: {
//         type: Number,
//         required: [true, "Year number is required"],
//         unique: true,
//         index: true
//     },
//     events: [{ type: Schema.Types.ObjectId, ref: 'Attack' }],
//     sumOfAttackes: { type: Number, default: 0 },
//     sumOfCasualties: { type: Number, default: 0 },
//     groupsSumData: [{ 
//         name: { type: String, required: true },
//         totalCasualties: { type: Number, required: true },
//         totalAttackes: { type: Number, required: true }
//     }],
//     month:{month: Number, sumOfAttackes: Number, sumOfCasualties: Number}
// }, {
//     timestamps: true,
//     collection: 'years'
// });

// export const YearAnaliticsModel = model<IYearAnalinics>('YearAnalitics', regionSchema);
// export default YearAnaliticsModel;