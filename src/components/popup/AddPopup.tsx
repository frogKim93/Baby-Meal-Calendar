import {Meal, Time, TimeList, TimeName} from "../../interfaces/Meal";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Day, SavedData} from "../../interfaces/Day";
import {SaveDays} from "../../utils/LocalStorageManager";

interface Props {
    isEditMode: boolean,
    day: Day,
    meal: Meal | null,
    time: Time | null,
    close: () => void,
    refresh: () => void,
}

export const AddPopup = (props: Props) => {
    const [startDate, setStartDate] = useState<string>("");
    const [meal, setMeal] = useState<Meal>({
        time: Time.BREAKFAST,
        name: "",
        weight: 0
    });

    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.meal) {
            setMeal({...props.meal});
        } else if (props.time != null) {
            setMeal({
                ...meal,
                time: props.time
            });
        }

        setStartDate(`${props.day.year}-${props.day.month.toString().padStart(2, "0")}-${props.day.date.toString().padStart(2, "0")}`);
    }, [props.meal, props.time]);

    const changeValue = (change: ChangeEvent) => {
        const target = change.target as HTMLInputElement;

        if (target.id === "ingredientName") {
            setMeal({...meal, name: target.value});
        } else if (target.id === "ingredientAmount") {
            target.value = parseInt(target.value).toString();
            setMeal({...meal, weight: parseInt(target.value)});
        } else {
            setMeal({...meal, time: TimeList()[parseInt(target.value)]});
        }
    }

    const save = () => {
        if (meal.name === "" || meal.weight === 0) {
            alert("다시 한 번 확인해주세요.");
            return;
        }

        updateMeals();
        props.close();
    }

    const updateMeals = () => {
        let savedData = localStorage.getItem("days");
        const days: Day[] = [];

        if (savedData) {
            const parsedData = JSON.parse(savedData) as SavedData;
            parsedData.days.forEach(day => {
                days.push(day);
            });
        }

        let startDate = new Date(startDateRef.current!.value);
        const endDate = new Date(endDateRef.current!.value);

        while (startDate.getTime() <= endDate.getTime()) {
            let foundDay = days.find(day => day.year === startDate.getFullYear() && day.month === startDate.getMonth() + 1 && day.date === startDate.getDate());

            if (!foundDay) {
                foundDay = {
                    year: startDate.getFullYear(),
                    month: startDate.getMonth() + 1,
                    date: startDate.getDate(),
                    isOtherMonth: false,
                    meals: []
                };
            }

            if (props.isEditMode) {
                const mealIndex = foundDay.meals.findIndex(meal => meal.time === props.meal?.time && meal.name === props.meal.name && meal.weight === props.meal.weight);
                foundDay.meals[mealIndex] = meal;
            } else {
                foundDay.meals.push(meal);
            }

            days.push(foundDay);
            startDate.setDate(startDate.getDate() + 1);
        }

        SaveDays(days);
        props.refresh();
    }

    return (
        <div className="modal" id="addModal">
            <div className="modal-content">
                <h3 id="modalTitle">재료 {props.isEditMode ? '수정' : '추가'}</h3>
                <div className="form-group">
                    <label htmlFor="ingredientName">재료명</label>
                    <input type="text" id="ingredientName" value={meal.name} onChange={changeValue}
                           placeholder="예: 쌀, 당근, 바나나"/>
                </div>
                <div className="form-group">
                    <label htmlFor="ingredientAmount">그램 수 (g)</label>
                    <input type="number" id="ingredientAmount" value={meal.weight} onChange={changeValue}
                           placeholder="예: 50" min="1"/>
                </div>
                <div className="form-group">
                    <label htmlFor="mealType">식사 유형</label>
                    <select id="mealType" onChange={changeValue}>
                        {TimeList().map(time => {
                            return (
                                <option key={time} value={time} selected={meal.time === time}>{TimeName(time)}</option>
                            );
                        })}
                    </select>
                </div>
                <div className={`form-group ${props.isEditMode && 'hidden'}`}>
                    <label>기간 설정</label>
                    <div className="date-inputs">
                        <div>
                            <label htmlFor="startDate">시작일</label>
                            <input ref={startDateRef} type="date" id="startDate" defaultValue={startDate}/>
                        </div>
                        <div>
                            <label htmlFor="endDate">종료일</label>
                            <input ref={endDateRef} type="date" id="endDate" min={startDate}
                                   defaultValue={startDate}/>
                        </div>
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={() => save()} className="modal-btn confirm-btn">저장</button>
                    <button onClick={() => props.close()} className="modal-btn cancel-btn">취소</button>
                </div>
            </div>
        </div>
    )
}