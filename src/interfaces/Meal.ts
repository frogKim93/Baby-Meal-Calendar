export enum Time {
    BREAKFAST, LUNCH, DINNER, SNACK
}

export const TimeList = () => {
    return [Time.BREAKFAST, Time.LUNCH, Time.DINNER, Time.SNACK];
}

export const TimeName = (time: Time) => {
    switch (time) {
        case Time.BREAKFAST :
            return "아침";
        case Time.LUNCH :
            return "점심";
        case Time.DINNER :
            return "저녁";
        case Time.SNACK :
            return "간식";
    }
}

export const TimeClassName = (time: Time) => {
    switch (time) {
        case Time.BREAKFAST :
            return "morning";
        case Time.LUNCH :
            return "lunch";
        case Time.DINNER :
            return "dinner";
        case Time.SNACK :
            return "snack";
    }
}

export interface Meal {
    time: Time,
    name: string;
    weight: number;
}