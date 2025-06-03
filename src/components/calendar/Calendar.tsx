import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Day} from "../../interfaces/Day";
import {Meal, TimeClassName} from "../../interfaces/Meal";
import {GetDays, UpdateDay} from "../../utils/LocalStorageManager";

const weeks = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
    setDay: (day: Day | null) => void
}

export interface CalendarRef {
    renderCalendar: () => void;
}

export const Calendar = forwardRef<CalendarRef, Props>((props, ref) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [days, setDays] = useState<Day[]>([]);

    useImperativeHandle(ref, () => ({
        renderCalendar
    }));

    useEffect(() => {
        renderCalendar();
    }, [currentDate]);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        const newDays: Day[] = [];
        const savedDays: Day[] = GetDays();

        for (let i = startDay - 1; i >= 0; i--) {
            const date = new Date(firstDay.getTime());
            date.setDate(firstDay.getDate() - 1 - i);

            newDays.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                isOtherMonth: true,
                meals: getFilteredMeals(savedDays, date.getFullYear(), date.getMonth() + 1, date.getDate())
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(firstDay.getTime());
            newDays.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: day,
                isOtherMonth: false,
                meals: getFilteredMeals(savedDays, date.getFullYear(), date.getMonth() + 1, day)
            });
        }

        for (let i = 6; i > lastDay.getDay(); i--) {
            const date = new Date();
            date.setFullYear(year, month + 1, 7 - i);

            newDays.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                isOtherMonth: true,
                meals: getFilteredMeals(savedDays, date.getFullYear(), date.getMonth() + 1, date.getDate())
            });
        }

        setDays(newDays);
    }

    const getYearAndMonth = () => {
        return `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;
    }

    const changeMonth = (month: number) => {
        const newDate = new Date();
        newDate.setDate(1);
        newDate.setMonth(currentDate.getMonth() + month);

        setCurrentDate(newDate);
    }

    const getFilteredMeals = (days: Day[], year: number, month: number, date: number) => {
        const meals: Meal[] = [];

        let foundDay = days.find(day => day.year === year && day.month === month && day.date === date);
        if (foundDay) {
            for (let i = 0; i < foundDay.meals.length; i++) {
                meals.push(foundDay.meals[i]);
            }
        }

        meals.sort((mealA, mealB) => mealA.time - mealB.time);
        return meals;
    }

    const removeMeal = (event: React.MouseEvent, day: Day, targetMeal: Meal) => {
        event.stopPropagation();
        day.meals = day.meals.filter(meal => meal !== targetMeal);
        UpdateDay(day);
        renderCalendar();
    }

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)} className="nav-btn">◀ 이전달</button>
                <div className="month-year" id="monthYear">
                    {getYearAndMonth()}
                </div>
                <button onClick={() => changeMonth(1)} className="nav-btn">다음달 ▶</button>
            </div>

            <div className="calendar" id="calendar">
                {weeks.map(day => {
                    return (
                        <div key={day} className="day-header">
                            {day}
                        </div>
                    )
                })}
                {days.map((day, index) => {
                    return (
                        <div key={index} className={`day ${day.isOtherMonth && "other-month"}`}
                             onClick={() => props.setDay(day)}>
                            <div className="day-number">{day.date}</div>
                            <div className="ingredient-tags">
                                {day.meals.map((meal, mealIndex) => {
                                    return (
                                        <div onClick={e => removeMeal(e, day, meal)} key={mealIndex}
                                             className={`ingredient-tag ${TimeClassName(meal.time)}`}>
                                            {`${meal.name} ${meal.weight}g`}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
});