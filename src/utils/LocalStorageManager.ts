import {Day, SavedData} from "../interfaces/Day";

export const GetDays = () => {
    const savedDays: Day[] = [];

    let savedData = localStorage.getItem("days");

    if (savedData) {
        const parsedData = JSON.parse(savedData) as SavedData;
        parsedData.days.forEach(day => {
            savedDays.push(day);
        });
    }

    return savedDays;
}

export const SaveDays = (days: Day[]) => {
    localStorage.setItem("days", JSON.stringify({days: days}));
}

export const UpdateDay = (day: Day) => {
    let savedData = localStorage.getItem("days");
    const days: Day[] = [];

    if (savedData) {
        const parsedData = JSON.parse(savedData) as SavedData;
        parsedData.days.forEach(day => {
            days.push(day);
        });
    }

    let dayIndex = days.findIndex(d => d.year === day.year && d.month === day.month && d.date === day.date);

    if (dayIndex >= 0) {
        days[dayIndex] = day;
    } else {
        days.push(day);
    }

    SaveDays(days);
}

export const GetDay = (year: number, month: number, date: number) => {
    let savedData = localStorage.getItem("days");
    let foundDay;

    if (savedData) {
        const parsedData = JSON.parse(savedData) as SavedData;
        foundDay = parsedData.days.find(day => day.year === year && day.month === month && day.date === date);
    }

    if (!foundDay) {
        foundDay = {
            year: year,
            month: month,
            date: date,
            meals: [],
            isOtherMonth: false
        }
    }

    return foundDay;
}

export interface MonthData {
    year: number,
    month: number
}

export const MonthList = () => {
    const list: MonthData[] = [];
    const savedData = localStorage.getItem("days");

    if (savedData) {
        const parsedData = JSON.parse(savedData) as SavedData;
        parsedData.days.forEach(day => {
            if (!list.find(item => item.year === day.year && item.month === day.month)) {
                list.push({
                    year: day.year,
                    month: day.month
                });
            }
        });
    }

    return list;
}

export const RemoveMonth = (year: number, month: number) => {
    const filteredDays = GetDays().filter(day => day.year !== year || day.month !== month);
    SaveDays(filteredDays);
}

export const Reset = () => {
    localStorage.clear();
}