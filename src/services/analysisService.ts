import AttackTypeModel from "../models/attackType";
import GroupModel from "../models/group";
import RegionModel from "../models/region";
import YearModel from "../models/Year";

export const deadliestAttacksService = async () => {
    try {
        const result = await AttackTypeModel.aggregate([
            {
              $lookup: {
                from: 'events',  
                let: { typeName: '$name' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$attacktype1_txt', '$$typeName']
                      }
                    }
                  }
                ],
                as: 'attacks'
              }
            },
            {
              $addFields: {
                totalKills: {
                  $reduce: {
                    input: '$attacks',
                    initialValue: 0,
                    in: {
                      $add: [
                        '$$value',
                        { $ifNull: ['$$this.nkill', 0] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                totalKills: 1,
                attackCount: { $size: '$attacks' }
              }
            },
            {
              $sort: {
                totalKills: -1
              }
            }
          ]);
        
          return result;
    } catch (error) {
        throw error
    }
}

export const highestCasualtyRegionsService = async () => {
    try {
        const result = await RegionModel.aggregate([
            {
              $lookup: {
                from: 'events',  
                let: { regionName: '$name' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$region_txt', '$$regionName']
                      }
                    }
                  }
                ],
                as: 'attacks'
              }
            },
            {
              $addFields: {
                totalKills: {
                  $reduce: {
                    input: '$attacks',
                    initialValue: 0,
                    in: {
                      $add: [
                        '$$value',
                        { $ifNull: ['$$this.nkill', 0] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                totalKills: 1,
                attackCount: { $size: '$attacks' }
              }
            },
            {
              $sort: {
                totalKills: -1
              }
            }
          ]);
        
          return result;
        
    } catch (error) {
        throw error
    }
}

export const incidentTrendsService = async (yearNum: number) => {
    try{
    const yearData = await YearModel.findOne({ year_num: yearNum }).populate('events');
    
    if (!yearData) {
        throw new Error(`Year ${yearNum} not found`);
    }

    const result: {
        year: number;
        totalKills: number;
        [key: string]: number;
    } = {
        year: yearNum,
        month1: 0,
        month2: 0,
        month3: 0,
        month4: 0,
        month5: 0,
        month6: 0,
        month7: 0,
        month8: 0,
        month9: 0,
        month10: 0,
        month11: 0,
        month12: 0,
        totalKills: 0
    };
    yearData.events.forEach((event: any) => {
        if (event.nkill && event.imonth) {
            const monthKey = `month${event.imonth}`;
            result[monthKey] += event.nkill;
            result.totalKills += event.nkill;
        }
    });

    return result;
    } catch (error) {
        throw error
    }
}

