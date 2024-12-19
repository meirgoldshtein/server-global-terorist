import { Router } from "express";
import  AttackModel from "../models/Attack";
import { addNewAttack, deadliestAttacks, highestCasualtyRegions, incidentTrends, search } from "../controllers/analysisController";
const router = Router();

router.get("/search/:keywords", search);

router.post("/add-new-attack", addNewAttack);
//מחזיר סוגי התקפות מדורגים לפי מספר הנפגעים הכולל 
router.get("/deadliest-attack-types",deadliestAttacks);

//מחזיר אזורים עם ממוצע נפגעים הגבוה ביותר.
router.get("/highest-casualty-regions", highestCasualtyRegions)

//: מחזיר תדירות תקריות לפי שנים וחודשים כמות התקריות הייחודיות במהלך התקופה הנבחנת.
// לדוגמא: אם בוחנים 12 חודשים עבור שנה מסוימת, צריך לעשות aggregation לפי החודשים וכמות
// תקריות ייחודיות באותם חודשים
router.get("/incident-trends/:yearNum", incidentTrends)

export default router;