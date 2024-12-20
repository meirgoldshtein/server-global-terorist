import { IAttack } from "../models/Attack";
import GroupModel, { IGroup } from "../models/group";
import RegionModel from "../models/region";
import RegionAnaliticsModel from "../models/regionAnalitics";

interface IGroupSumData {
    name: string;
    totalCasualties: number;
    totalAttackes: number
}

interface IRegionData {
    name: string;
    groupsSumData: IGroupSumData[];
    sumOfAttackes: number;
    sumOfCasualties: number;
    
}
    

// מחזיר מערך אובייקטים של כל האיזורים
const createRegionsList = async (): Promise<IRegionData[]> => {
    try {
        const regions = await RegionModel.find({}).select('name');
        return regions.map(region => {
            return { name: region.name, groupsSumData: [], sumOfAttackes: 0, sumOfCasualties: 0 }
        });
    } catch (error) {
        throw error;
    }
}

// מחזיר מערך אובייקטים של כל הארגונים
const createGroupsList = async () => {
    try {
        const groups = await GroupModel.find({}).select('name');
        return groups.map(group => {
            return { name: group.name, groupsData: [] }
        });
    } catch (error) {
        throw error;
    }
}

// מסנן את כל האירועים של ארגון מסויים באיזור מסויים
const sumAllGroupCasualtiesInRegion = async (regionName: string, groupName: string): Promise<IGroup|null> => {
    try {
        const groupData = await GroupModel.findOne({ name: groupName }).populate({
            path: 'events',
            match: { region_txt: regionName },
            select: 'nkill nwound'
        });
        if(!groupData) {
            return null;
        }
        return groupData;

    } catch (error) {
        throw error;
    }
}

// מסכם את כמות הנפגעים ממערך של מתקפות של קבוצה מסויימת
const sumAllRegionCasualtiesInGroup = async (attacks: IGroup): Promise<IGroupSumData|null> => {
    try {
        let CasualtiesCounter = 0;
        let AttacksCounter = attacks.events.length;
        attacks.events.forEach((attack: any) => {
            CasualtiesCounter += (attack.nkill || 0) + (attack.nwound || 0);
        });

        return {
            name: attacks.name,
            totalCasualties: CasualtiesCounter,
            totalAttackes: AttacksCounter
        }

    } catch (error) {
        throw error;
    }
}

// יוצר מערך של איזורים וארגונים עם סיכום הנפגעים לכל ארגון
export const generateRegionsAndSumGroupsList = async () => {
    try {
        const regions = await createRegionsList();
        const groups = await createGroupsList();

        for (const region of regions) {
            console.log("start to process region: " + region.name);
            for (const group of groups) {
                if(group.name === "Unknown") {
                    continue;
                }
                const GroupsFiltering = await sumAllGroupCasualtiesInRegion(region.name, group.name);
            
                if (!GroupsFiltering) {
                    console.log("bla bla");
                    continue; // דילוג על הקבוצה אם אין נתונים
                }
                const sumGroupsCasualties = await sumAllRegionCasualtiesInGroup(GroupsFiltering);
                if (sumGroupsCasualties) {
                    region.groupsSumData.push(sumGroupsCasualties); // הוספת הנתונים ישירות
                    region.sumOfAttackes += GroupsFiltering.events.length;
                    region.sumOfCasualties += sumGroupsCasualties.totalCasualties;
                }
            }
        }

        return regions;
    } catch (error) {
        throw error;
    }
};

//ממיין את הארגונים בכל איזור לפי מספר נפגעים
export const sortDeadliestGroupsInRegion = (regions: IRegionData[]) => {

    regions.forEach(region => {
        region.groupsSumData.sort((a, b) => b.totalCasualties - a.totalCasualties);
    })

    return regions;
}

// הפונקצייה הראשית שמציגה את כל האיזורים הקיימים ובתוכם הארגונים ומספר הנפגעים בצורה ממויינת
export const findTheMostDeadliestRegion = async ( groupName: string) => {

    try {
        const regions = await generateRegionsAndSumGroupsList();
        
        const sortedRegions = sortDeadliestGroupsInRegion(regions);
        const toReturn: IRegionData[] = [];
        sortedRegions.forEach(region => {
            if(region.groupsSumData[0].name === groupName) {
                toReturn.push(region);
            }
        })
    
        return toReturn;
    } catch (error) {
        return error;
    }
    
}

export const seedRegionAnalytics = async () => {

    try {
        
        const regions = await generateRegionsAndSumGroupsList();      
        const sortedRegions = sortDeadliestGroupsInRegion(regions);
        console.log(sortedRegions)
        console.log("start to seed region analytics");
        for (const region of sortedRegions) {
            const newRegion = new RegionAnaliticsModel({ 
                name: region.name, 
                groupsSumData: region.groupsSumData, 
                sumOfAttackes: region.sumOfAttackes, 
                sumOfCasualties: region.sumOfCasualties 
            });
            await newRegion.save(); 
    
            console.log("added region: " + region.name);
        }
        console.log("finished to seed region analytics");
    } catch (error) {
        console.log(error)
        return error;
    }
    
}
export { createRegionsList,
     createGroupsList,
      sumAllGroupCasualtiesInRegion,
       sumAllRegionCasualtiesInGroup,
   }