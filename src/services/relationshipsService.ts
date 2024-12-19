import GroupModel from "../models/group";
import RegionModel from "../models/region";

export const topGroupsService = async (regionName: string) => {
    try {

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

const groupsByYearService = async () => {
    try {
        
    } catch (error) {
        
    }
}

const deadliestRegionsService = async () => {
    try {
        
    } catch (error) {
        
    }
}