import { Schema, model } from 'mongoose';

export interface IGroup {
    name: string;
    events: Schema.Types.ObjectId[];
}

const groupSchema = new Schema<IGroup>({
    name: {
        type: String,
        required: [true, "Group name is required"],
        unique: true,
        index: true
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Attack' }]
}, {
    timestamps: true,
    collection: 'groups'
});

export const GroupModel = model<IGroup>('Group', groupSchema);
export default GroupModel;