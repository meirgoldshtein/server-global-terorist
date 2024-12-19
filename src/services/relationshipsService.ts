import AttackModel from "../models/Attack";
import GroupModel from "../models/group";
import RegionModel from "../models/region";
import YearModel from "../models/Year";
import { IAttack } from "../models/Attack";
import { findTheMostDeadliestRegion } from "../utils/agrigations";
import RegionAnaliticsModel, { IGroupSumData } from "../models/regionAnalitics";

export const topGroupsService = async (regionName: string) => {
    try {
        const allRegionsAnalytics = await RegionAnaliticsModel.find({name: regionName});
        return allRegionsAnalytics
    } catch (error) {
        throw error
    }
}
export const groupsByYearService = async (year: number) => {
    try {
        const yearData = await YearModel.findOne({ year_num: year });
        if (!yearData) {
            throw new Error('Year not found');
        }
        const groups = await GroupModel.find({}).populate({
            path: 'events',
            match: { iyear: year },
            select: '_id'
        });

        const result = groups.map(group => ({
            groupName: group.name,
            eventCount: group.events.length
        }));

        result.sort((a, b) => b.eventCount - a.eventCount);

        return result.filter(group => group.eventCount > 0);

    } catch (error) {
        throw error;
    }
}

export const deadliestRegionsService = async (groupName: string) => {
    try {
        let toReturn:{ regionName: string; regionData: IGroupSumData; }[] = [];
        const allRegionsAnalytics = await RegionAnaliticsModel.find({});
        for(const regionAnalytics of allRegionsAnalytics) {
            if(regionAnalytics.groupsSumData[0].name === groupName) {
                toReturn.push({regionName: regionAnalytics.name, regionData:regionAnalytics.groupsSumData[0]});
            }
        }
        return toReturn;
    } catch (error) {
        console.log(error)
        throw error;
    }
}


// export const topGroupsService2 = async (regionName: string) => {
//     try {
//         const region = await RegionModel.findOne({ name: regionName });
//         if (!region) {
//             throw new Error('Region not found');
//         }
//         const groups = await GroupModel.find({}).populate({
//             path: 'events',
//             match: { region_txt: regionName },
//             select: '_id'
//         });

//         const result = groups.map(group => ({
//             groupName: group.name,
//             eventCount: group.events.length
//         }));

//         result.sort((a, b) => b.eventCount - a.eventCount);

//         return result.filter(group => group.eventCount > 0);
//     } catch (error) {
//         throw error;
//     }
// }
