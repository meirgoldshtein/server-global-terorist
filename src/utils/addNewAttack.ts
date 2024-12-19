import { IAttack } from "../models/Attack";
import AttackTypeModel from "../models/attackType";
import GroupModel from "../models/group";
import RegionModel from "../models/region";
import RegionAnaliticsModel from "../models/regionAnalitics";
import YearModel from "../models/Year";

const updateYearModel = async (year: number, attack: IAttack) => {
    await YearModel.findOneAndUpdate({ iyear: year },
        { $push: { events: attack._id } },
        { new: true }).exec();
}

const updateAttackTypeModel = async (attackType: string, attack: IAttack) => {
    await AttackTypeModel.findOneAndUpdate({ name: attackType }, { $push: { events: attack._id } }, { new: true }).exec();
}

const updateGroupModel = async (groupName: string, attack: IAttack) => {
    await GroupModel.findOneAndUpdate({ name: groupName }, { $push: { events: attack._id } }, { new: true }).exec();
}

const updateRegionModel = async (regionName: string, attack: IAttack) => {
    await RegionModel.findOneAndUpdate({ name: regionName }, { $push: { events: attack._id } }, { new: true }).exec();
}

const updateRegionAnalyticsModel = async (regionName: string, attack: IAttack) => {
    try {
        const casualties = attack.nkill || 0;  // אם אין הרוגים, נשתמש ב-0
        
        const updateQuery = {
            $inc: {
                sumOfAttackes: 1,  // תמיד נעלה ב-1 את מספר ההתקפות
                sumOfCasualties: casualties  // נעלה את מספר ההרוגים הכולל
            }
        };

        // אם יש הרוגים, נעדכן גם את ה-groupsSumData
        if (casualties > 0) {
            await RegionAnaliticsModel.findOneAndUpdate(
                { 
                    name: regionName,
                    'groupsSumData.name': attack.gname  // מחפשים את הארגון הספציפי
                },
                {
                    ...updateQuery,
                    $inc: { 'groupsSumData.$.totalCasualties': casualties }  // עדכון ההרוגים לארגון הספציפי
                },
                { new: true }
            ).exec();

            // אם הארגון לא קיים ברשימה, נוסיף אותו
            await RegionAnaliticsModel.findOneAndUpdate(
                { 
                    name: regionName,
                    'groupsSumData.name': { $ne: attack.gname }  // מוודאים שהארגון לא קיים
                },
                {
                    ...updateQuery,
                    $push: { 
                        groupsSumData: {
                            name: attack.gname,
                            totalCasualties: casualties
                        }
                    }
                },
                { new: true }
            ).exec();
        } else {
            // אם אין הרוגים, רק נעדכן את מספר ההתקפות והאירועים
            await RegionAnaliticsModel.findOneAndUpdate(
                { name: regionName },
                updateQuery,
                { new: true }
            ).exec();
        }

    } catch (error) {
        console.error('Error updating region analytics:', error);
        throw error;
    }
};

export const addNewAttackUtil = async (attack: IAttack) => {
    try {
        await updateYearModel(attack.iyear, attack);
        await updateAttackTypeModel(attack.attacktype1_txt, attack);
        await updateGroupModel(attack.gname, attack);
        await updateRegionModel(attack.region_txt, attack);
        await updateRegionAnalyticsModel(attack.region_txt, attack);
        return attack;
    } catch (error) {
        throw error;
    }
}