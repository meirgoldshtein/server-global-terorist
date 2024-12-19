import AttackTypeModel from "../models/attackType";
import GroupModel from "../models/group";
import RegionModel from "../models/region";

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

const incidentTrends = async () => {
    try {
        
    } catch (error) {
        throw error
    }
}

