import {Meal} from "./Meal";

export interface Day {
    year: number;
    month: number;
    date: number;
    isOtherMonth: boolean;
    meals: Meal[];
}

export interface SavedData {
    days: Day[];
}