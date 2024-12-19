import GroupModel from "../models/group";
import RegionModel from "../models/region";
import YearModel from "../models/Year";

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

const deadliestRegionsService = async () => {
    try {

    } catch (error) {

    }
}