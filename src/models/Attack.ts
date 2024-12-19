import { Document, model, ObjectId, Schema, Types } from "mongoose";

export interface IAttack extends Document {
    eventid: number;
    iyear: number;
    imonth: number;
    iday: number;
    country_txt: string;
    region_txt: String;
    city: string;
    latitude: number;
    longitude: number;
    attacktype1_txt:String;
    targtype1_txt: string;
    target1: string;
    gname: String;
    weaptype1_txt: string;
    nkill: number | null;
    nwound: number | null;
    nperps: number | null;
    summary: string | null;
}

const eventSchema = new Schema<IAttack>({
    eventid: {
        type: Number,
        required: [true, "Event ID is required"],
        unique: true
    },
    iyear: {
        type: Number,
        required: [true, "Year is required"],
        min: [1900, "Year must be after 1900"],
        max: [new Date().getFullYear(), "Year cannot be in the future"]
    },
    imonth: {
        type: Number,
        required: [true, "Month is required"],
        min: [1, "Month must be between 1 and 12"],
        max: [12, "Month must be between 1 and 12"]
    },
    iday: {
        type: Number,
        required: [true, "Day is required"],
        min: [0, "Day must be between 0 and 31"],
        max: [31, "Day must be between 0 and 31"]
    },
    country_txt: {
        type: String,
        required: [true, "Country is required"]
    },
    region_txt: {
        type: String,
        required: [true, "Region is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    },
    gname: {
        type: String,
        required: [true, "Terrorist Group is required"]
    },
    attacktype1_txt: {
        type: String,
        required: [true, "Attack type is required"]
    },
    targtype1_txt: {
        type: String,
        required: [true, "Target type is required"],
        trim: true
    },
    target1: {
        type: String
    },
    latitude: {
        type: Number,
        required: [true, "Latitude is required"],
        min: [-90, "Latitude must be between -90 and 90"],
        max: [90, "Latitude must be between -90 and 90"]
    },
    longitude: {
        type: Number,
        required: [true, "Longitude is required"],
        min: [-180, "Longitude must be between -180 and 180"],
        max: [180, "Longitude must be between -180 and 180"]
    },
    nkill: {
        type: Number,
        default: null,
        min: [0, "Number of kills cannot be negative"]
    },
    weaptype1_txt: {
        type: String,
        required: [true, "Weapon type is required"]
    },
    nwound: {
        type: Number,
        default: null,
        min: [0, "Number of wounds cannot be negative"]
    },
    nperps: {
        type: Number,
        default: null
    },
    summary: {
        type: String,
        default: null,
        trim: true,
        maxlength: [5000, "Summary cannot exceed 5000 characters"]
    }
}, {
    timestamps: true, 
    collection: 'events' 
});


export const AttackModel = model<IAttack>('Attack', eventSchema);

export default AttackModel;