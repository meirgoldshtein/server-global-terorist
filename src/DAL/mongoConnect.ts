import { connect } from "mongoose";
import 'dotenv/config';
import AttackModel from "../models/Attack";
import fs from 'fs';
import RegionModel from "../models/region";
import GroupModel from "../models/group";
import AttackTypeModel from "../models/attackType";
import YearModel from "../models/Year";
import path from "path";

export const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI as string);
        const db_is_empty = await AttackModel.countDocuments();
        if (db_is_empty === 0) {
            // await seed();
            console.log("first seed");
        }
        console.log("db connected");
    } catch (error) {
        console.log(error);
    }
}



// async function seedDatabase(jsonFilePath: string) {

//     const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
//     const terrorEvents = JSON.parse(rawData);


//     const uniqueRegions = new Set(terrorEvents.map((event: any) => event.region_txt));
//     const uniqueGroups = new Set(terrorEvents.map((event: any) => event.gname));
//     const uniqueAttackTypes = new Set(terrorEvents.map((event: any) => event.attacktype1_txt));
//     const uniqueYears = new Set(terrorEvents.map((event: any) => event.iyear));


    //     const regionPromises = Array.from(uniqueRegions).map(regionName =>
    //         RegionModel.findOneAndUpdate(
    //             { name: regionName },
    //             { name: regionName },
    //             { upsert: true, new: true }
    //         )
    //     );

    //     const regions = await Promise.all(regionPromises);
    //     console.log(`Seeded ${regions.length} unique regions`);


    //     const groupPromises = Array.from(uniqueGroups).map(groupName =>
    //         GroupModel.create({ name: groupName, events: [] })
    //     );
    //     const groups = await Promise.all(groupPromises);
    //     console.log(`Seeded ${groups.length} unique groups`);


    //     const attackTypePromises = Array.from(uniqueAttackTypes).map(attackTypeName =>
    //         AttackTypeModel.create({ name: attackTypeName, events: [] })
    //     );
    //     const attackTypes = await Promise.all(attackTypePromises);
    //     console.log(`Seeded ${attackTypes.length} unique attack types`);

    //     const yearsPromises = Array.from(uniqueYears).map(year =>
    //         RegionModel.create({ name: year, events: [] })
    //     )

    //     const years = await Promise.all(yearsPromises);
    //     console.log(`Seeded ${years.length} unique years`);

    //     const events = await AttackModel.countDocuments();
    //     console.log(`added ${events} events successfully`);

    //    
    //     const batchSize = 1000;
    // 
    //     let successCount = 0;
    //     let failCount = 0;
    //     for (let i = 0; i < terrorEvents.length; i += batchSize) {
    //         const batch = terrorEvents.slice(i, i + batchSize);

    //         const eventPromises = batch.map(async (event: any) => {
    //             try {

    //                 let imonth = event.imonth;
    //                 imonth == 0 ? imonth = 1 : imonth = imonth;
    //                 const newEvent = new AttackModel({
    //                     ...event,
    //                     imonth,
    //                 })

    //                 await newEvent.save();

    //                 const updateRegion = await RegionModel.findOneAndUpdate(
    //                     { name: event.region_txt },
    //                     { $push: { events: newEvent._id } },
    //                     { upsert: true, new: true }
    //                 )

    //                 const updateGroup = await GroupModel.findOneAndUpdate(
    //                     { name: event.gname },
    //                     { $push: { events: newEvent._id } },
    //                     { upsert: true, new: true }
    //                 )

    //                 const updateAttackType = await AttackTypeModel.findOneAndUpdate(
    //                     { name: event.attacktype1_txt },
    //                     { $push: { events: newEvent._id } },
    //                     { upsert: true, new: true }
    //                 )

    //                 const updateYear = await YearModel.findOneAndUpdate(
    //                     { year_num: event.iyear },
    //                     { $push: { events: newEvent._id } },
    //                     { upsert: true, new: true }
    //                 )
    //                 updateYear.save();
    //                 successCount++;
    //             } catch (saveError) {
    //                 console.error(`Error saving event ${event.eventid}:`, saveError);
    //                 failCount++;
    //             }
    //         });

    //         await Promise.all(eventPromises);
    //         console.log(`Processed batch ${i / batchSize + 1}, Success: ${successCount}, Fail: ${failCount}`);
    //     }
    // }


    async function seedDatabase2(jsonFilePath: string) {

        const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
        const terrorEvents = JSON.parse(rawData);


        const uniqueRegions = [...new Set(terrorEvents.map((event: any) => event.region_txt))];
        const uniqueGroups = [...new Set(terrorEvents.map((event: any) => event.gname))];
        const uniqueAttackTypes = [...new Set(terrorEvents.map((event: any) => event.attacktype1_txt))];
        const uniqueYears = [...new Set(terrorEvents.map((event: any) => event.iyear))];


        await Promise.all([
            RegionModel.insertMany(uniqueRegions.map(name => ({ name, events: [] }))),
            GroupModel.insertMany(uniqueGroups.map(name => ({ name, events: [] }))),
            AttackTypeModel.insertMany(uniqueAttackTypes.map(name => ({ name, events: [] }))),
            YearModel.insertMany(uniqueYears.map(year => ({ year_num: year, events: [] })))
        ]);


        const batchSize = 5000;
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < terrorEvents.length; i += batchSize) {
            const batch = terrorEvents.slice(i, i + batchSize);

            const batchOperations = batch.map(async (event: any) => {
                try {

                    const imonth = event.imonth === 0 ? 1 : event.imonth;

                    const newEvent = new AttackModel({
                        ...event,
                        imonth
                    });

                    await newEvent.save();

                    // Update references in other models
                    await Promise.all([
                        RegionModel.findOneAndUpdate(
                            { name: event.region_txt },
                            { $push: { events: newEvent._id } }
                        ),
                        GroupModel.findOneAndUpdate(
                            { name: event.gname },
                            { $push: { events: newEvent._id } }
                        ),
                        AttackTypeModel.findOneAndUpdate(
                            { name: event.attacktype1_txt },
                            { $push: { events: newEvent._id } }
                        ),
                        YearModel.findOneAndUpdate(
                            { year_num: event.iyear },
                            { $push: { events: newEvent._id } }
                        )
                    ]);

                    successCount++;
                } catch (error) {
                    console.error(`Error processing event ${event.eventid}:`, error);
                    failCount++;
                }
            });

            await Promise.all(batchOperations);

            console.log(`Processed batch ${i / batchSize + 1}, Success: ${successCount}, Fail: ${failCount}`);
        }
    }
    const filePath = path.join(__dirname, '..', '..', 'data', 'initialEvents.json');




    // seedDatabase2(filePath).then(() => {
    //     console.log('Database seeded successfully.');
    // }).catch((error) => {
    //     console.error('Error seeding database:', error);
    // });