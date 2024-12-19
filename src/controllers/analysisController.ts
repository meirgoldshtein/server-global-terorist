import { Request, Response } from "express";
import { deadliestAttacksService, highestCasualtyRegionsService, incidentTrendsService } from "../services/analysisService";

export const deadliestAttacks = async (req: Request, res: Response) => {
    try {
        const response = await deadliestAttacksService();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const highestCasualtyRegions = async (req: Request, res: Response) => {
    try {
        const response = await highestCasualtyRegionsService();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const incidentTrends = async (req: Request, res: Response) => {
    try {
        const yearNum = Number(req.params.yearNum);
        if  (!yearNum) {
            throw new Error('Year number is required');
        }
        const response = await incidentTrendsService(yearNum);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

