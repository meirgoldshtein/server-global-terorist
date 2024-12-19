import { Request, Response } from "express";
import { addNewAttackService, deadliestAttacksService, highestCasualtyRegionsService, incidentTrendsService, searchService } from "../services/analysisService";
import { io } from "../app";

export const search = async (req: Request, res: Response) => {
    try {
        const keyword = req.params.keyword;
        if (!keyword) {
            throw new Error('Keyword is required');
        }
        const response = await searchService(keyword);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const addNewAttack = async (req: Request, res: Response) => {
    try {
        const attack = req.body;
        const response = await addNewAttackService(attack);
        io.emit('new-attack', response);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

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

