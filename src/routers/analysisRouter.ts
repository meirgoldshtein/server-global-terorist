import { Router } from "express";
import  AttackModel from "../models/Attack";
const router = Router();

router.get("/test", async (req, res) => {
    try {
        const allEvents = await AttackModel.findOne({eventid: 197004080002});
        res.status(200).json(allEvents);
    } catch (error) {
        res.status(500).json(error);
    }
});


//מחזיר סוגי התקפות מדורגים לפי מספר הנפגעים הכולל 
router.get("/deadliest-attack-types", async (req, res) => {
   
});

//מחזיר אזורים עם ממוצע נפגעים הגבוה ביותר.
router.get("/highest-casualty-regions", async (req, res) => {
    
})

//: מחזיר תדירות תקריות לפי שנים וחודשים כמות התקריות הייחודיות במהלך התקופה הנבחנת.
// לדוגמא: אם בוחנים 12 חודשים עבור שנה מסוימת, צריך לעשות aggregation לפי החודשים וכמות
// תקריות ייחודיות באותם חודשים
router.get("/incident-trends", async (req, res) => {
    
})

export default router;