import { Schema, model } from 'mongoose';

export interface IAttackType {
    name: string;
    events: Schema.Types.ObjectId[];
}

const attackTypeSchema = new Schema<IAttackType>({
    name: {
        type: String,
        required: [true, "Attack type name is required"],
        unique: true,
        index: true
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Attack' }]
}, {
    timestamps: true,
    collection: 'attack_types'
});

export const AttackTypeModel = model<IAttackType>('AttackType', attackTypeSchema);
export default AttackTypeModel;