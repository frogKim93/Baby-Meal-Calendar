import React, {useEffect, useState} from "react";
import {Day} from "../../interfaces/Day";
import {Meal, Time, TimeList} from "../../interfaces/Meal";
import {AddPopup} from "./AddPopup";
import {GetDay, UpdateDay} from "../../utils/LocalStorageManager";

interface Props {
    day: Day,
    close: () => void,
    setDay: (day: Day) => void,
    refresh: () => void
}

export const DetailPopup = (props: Props) => {
    const [meal, setMeal] = useState<Meal | null>(null);
    const [time, setTime] = useState<Time | null>(null);
    const [isEditMode, setEditMode] = useState<boolean>(false);

    const getTitle = (time: Time) => {
        switch (time) {
            case Time.BREAKFAST :
                return "🌅 아침";
            case Time.LUNCH :
                return "🌞 점심";
            case Time.DINNER :
                return "🌆 저녁";
            case Time.SNACK :
                return "🍪 간식";
        }
    }

    const closeAddPopup = () => {
        setMeal(null);
        setTime(null);
        setEditMode(false);
    }

    const edit = (meal: Meal) => {
        setEditMode(true);
        setMeal(meal);
    }

    const remove = (targetMeal: Meal) => {
        const day = props.day;
        day.meals = props.day.meals.filter(meal => targetMeal !== meal);

        UpdateDay(day);
        refresh();
    }

    const refresh = () => {
        props.setDay({...GetDay(props.day.year, props.day.month, props.day.date)});
        props.refresh();
    }

    return (
        <>
            <div className="detail-modal" id="detailModal">
                <div className="detail-modal-content">
                    <div className="detail-header">
                        <h2 id="detailTitle">{props.day.date}일의 이유식</h2>
                        <button onClick={() => props.close()} className="close-btn">&times;</button>
                    </div>
                    <div className="detail-body">
                        {TimeList().map(time => {
                            return (
                                <div key={time} className="meal-section">
                                    <div className="meal-title">
                                        <h3>{getTitle(time)}</h3>
                                        <button onClick={() => setTime(time)} className="add-ingredient-btn">
                                            + 추가
                                        </button>
                                    </div>
                                    <div className="ingredient-list">
                                        {props.day.meals.filter(meal => meal.time === time).map(meal => {
                                            return (
                                                <div key={meal.name} className="ingredient-item">
                                                    <div className="ingredient-info">
                                                        <div className="ingredient-name">{meal.name}</div>
                                                        <div className="ingredient-amount">{meal.weight}g</div>
                                                    </div>
                                                    <div className="ingredient-actions">
                                                        <button onClick={() => edit(meal)}
                                                                className="action-btn edit-btn">수정
                                                        </button>
                                                        <button onClick={() => remove(meal)}
                                                                className="action-btn delete-btn">삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {(time != null || meal) &&
                <AddPopup isEditMode={isEditMode} day={props.day} meal={meal} time={time} refresh={() => refresh()}
                          close={() => closeAddPopup()}/>}
        </>
    )
}