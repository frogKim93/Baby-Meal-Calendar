import React, {useEffect, useRef, useState} from "react";
import "./App.css";
import {Header} from "./components/Header";
import {Calendar, CalendarRef} from "./components/calendar/Calendar";
import {DetailPopup} from "./components/popup/DetailPopup";
import {Day} from "./interfaces/Day";
import {Banner} from "./components/Banner";
import {UpdateDay} from "./utils/LocalStorageManager";

function App() {
    const [day, setDay] = useState<Day | null>(null);
    const calendarRef = useRef<CalendarRef>(null);
    const [isDeleteMode, setDeleteMode] = useState<boolean>(false);
    const [isCopyMode, setCopyMode] = useState<boolean>(false);
    const [dayForCopy, setDayForCopy] = useState<Day | null>(null);

    useEffect(() => {
        if (!isCopyMode) {
            setDayForCopy(null);
        }
    }, [isCopyMode]);

    const getBannerContent = () => {
        if (isDeleteMode) {
            return "재료를 클릭하여 삭제할 수 있습니다.\n종료 버튼 클릭 시, 삭제 모드가 종료됩니다.";
        }

        if (dayForCopy) {
            return `${dayForCopy.date}일의 데이터를 붙여넣기할 날짜칸을 클릭해주세요.\n종료 버튼 클릭 시, 복사 모드가 종료됩니다.`
        } else {
            return "복사할 날짜칸을 클릭 후 붙여넣기할 날짜칸을 클릭해주세요.\n종료 버튼 클릭 시, 복사 모드가 종료됩니다."
        }

    }

    const clickBannerButton = () => {
        setDeleteMode(false);
        setCopyMode(false);
    }

    const selectDay = (day: Day) => {
        if (isCopyMode) {
            if (!dayForCopy) {
                setDayForCopy(day);
            } else {
                const newDay = {
                    ...dayForCopy,
                    year: day.year,
                    month: day.month,
                    date: day.date
                };

                UpdateDay(newDay);
                calendarRef.current!.renderCalendar();
            }
        } else {
            setDay(day);
        }
    }

    return (
        <>
            <div className="floating-hearts" id="hearts"></div>
            <div className="container">
                <Header isDeleteMode={isDeleteMode} toggleDeleteMode={() => setDeleteMode(!isDeleteMode)}
                        isCopyMode={isCopyMode} toggleCopyMode={() => setCopyMode(!isCopyMode)}
                        refresh={() => calendarRef.current!.renderCalendar()}/>
                <Calendar ref={calendarRef} isDeleteMode={isDeleteMode} isCopyMode={isCopyMode} setDay={selectDay}/>
            </div>

            {day &&
                <DetailPopup day={day} setDay={setDay} close={() => setDay(null)}
                             refresh={() => calendarRef.current!.renderCalendar()}/>}

            {(isDeleteMode || isCopyMode) && <Banner content={getBannerContent()} click={() => clickBannerButton()}/>}
        </>
    )
}

export default App;