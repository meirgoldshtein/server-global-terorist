import { Router } from "express";
import  AttackModel from "../models/Attack";
const router = Router();

//מחזיר את חמשת הארגונים המובילים לפי מספר התקריות באזור שצוין
router.get("/top-groups", async (req, res) => {

});

//תיאור: מציג רשימת ארגונים שפעלו בשנה מסוימת עם מספר התקריות שלהם.
router.get("/groups-by-year", async (req, res) => {

});


// מזהה אזורים שבהם הארגון גרם למספר הנפגעים הגבוה ביותר. לאחר בחירת ארגון, התשובה
// תכיל את האיזורים שבהם הארגון גרם להתקפות הקטלניות ביותר כמות הנפגעים, הרוגים ופצועים,
// הגדולה ביותר ביחס לארגונים האחרים באותו האזור לכל התקופה
router.get("/deadliest-regions", async (req, res) => {

});

export default router;