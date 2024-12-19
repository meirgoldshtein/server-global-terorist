import { Request, Response } from "express";
import { topGroupsService } from "../services/relationshipsService";

export const topGroups = async (req: Request, res: Response) => {
    try {
        const regionName = req.params.regionName;
        if(!regionName) {
            throw new Error('Region name is required');
        }
        const response = await topGroupsService(regionName);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const groupsByYear = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}

export const deadliestRegions = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}