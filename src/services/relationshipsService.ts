import AttackModel from "../models/Attack";
import GroupModel from "../models/group";
import RegionModel from "../models/region";
import YearModel from "../models/Year";
import { IAttack } from "../models/Attack";
import { findTheMostDeadliestRegion } from "../utils/agrigations";
export const topGroupsService = async (regionName: string) => {
    try {
        const region = await RegionModel.findOne({ name: regionName });
        if (!region) {
            throw new Error('Region not found');
        }
        const groups = await GroupModel.find({}).populate({
            path: 'events',
            match: { region_txt: regionName },
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
            // צעד 1: קבלת כל האזורים הייחודיים במערכת
    const allRegions = await AttackModel.distinct('region_txt');
    
    const result = await Promise.all(allRegions.map(async region => {
        // צעד 2: חישוב סך הנפגעים של הארגון המבוקש באזור
        const groupStats = await AttackModel.aggregate([
            {
                $match: {
                    region_txt: region,
                    gname: groupName,
                    $or: [
                        { nkill: { $exists: true, $ne: null } },
                        { nwound: { $exists: true, $ne: null } }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalKilled: {
                        $sum: { $ifNull: ['$nkill', 0] }
                    },
                    totalWounded: {
                        $sum: { $ifNull: ['$nwound', 0] }
                    },
                    totalEvents: { $sum: 1 }
                }
            }
        ]);

        // צעד 3: חישוב סך הנפגעים של כל הארגונים האחרים באזור
        const otherGroupsStats = await AttackModel.aggregate([
            {
                $match: {
                    region_txt: region,
                    gname: { $ne: groupName },
                    $or: [
                        { nkill: { $exists: true, $ne: null } },
                        { nwound: { $exists: true, $ne: null } }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalKilled: {
                        $sum: { $ifNull: ['$nkill', 0] }
                    },
                    totalWounded: {
                        $sum: { $ifNull: ['$nwound', 0] }
                    },
                    totalEvents: { $sum: 1 }
                }
            }
        ]);

        // רק אם יש נתונים לארגון באזור זה
        if (groupStats.length > 0) {
            const groupData = groupStats[0];
            const otherGroupsData = otherGroupsStats[0] || { 
                totalKilled: 0, 
                totalWounded: 0, 
                totalEvents: 0 
            };

            // חישוב האחוזים מסך כל הנפגעים באזור
            const totalRegionCasualties = (groupData.totalKilled + groupData.totalWounded) +
                                        (otherGroupsData.totalKilled + otherGroupsData.totalWounded);
            
            const groupPercentage = totalRegionCasualties ? 
                ((groupData.totalKilled + groupData.totalWounded) / totalRegionCasualties * 100) : 0;

            return {
                region: region,
                groupCasualties: {
                    killed: groupData.totalKilled,
                    wounded: groupData.totalWounded,
                    total: groupData.totalKilled + groupData.totalWounded,
                    events: groupData.totalEvents
                },
                otherGroupsCasualties: {
                    killed: otherGroupsData.totalKilled,
                    wounded: otherGroupsData.totalWounded,
                    total: otherGroupsData.totalKilled + otherGroupsData.totalWounded,
                    events: otherGroupsData.totalEvents
                },
                percentageOfTotalCasualties: Math.round(groupPercentage * 100) / 100,
            };
        }
        return null;
    }));

    // סינון אזורים ללא נתונים ומיון לפי אחוז הנפגעים
    const filteredResults = result
        .filter(item => item !== null)
        .sort((a, b) => b!.percentageOfTotalCasualties - a!.percentageOfTotalCasualties);

    return filteredResults;
    } catch (error) {
        throw error;
    }
}

export const deadliestRegionsService2 = async (groupName: string) => {
    try {
        const sumCasualties = await findTheMostDeadliestRegion(groupName);
        return sumCasualties;
    } catch (error) {
        throw error;
    }
}