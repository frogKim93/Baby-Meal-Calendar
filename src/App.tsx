import React, {useRef, useState} from "react";
import "./App.css";
import {Header} from "./components/Header";
import {Calendar, CalendarRef} from "./components/calendar/Calendar";
import {DetailPopup} from "./components/popup/DetailPopup";
import {Day} from "./interfaces/Day";

function App() {
    const [day, setDay] = useState<Day | null>(null);
    const calendarRef = useRef<CalendarRef>(null);

    return (
        <>
            <div className="floating-hearts" id="hearts"></div>
            <div className="container">
                <Header refresh={() => calendarRef.current!.renderCalendar()}/>
                <Calendar ref={calendarRef} setDay={setDay}/>
            </div>

            {day &&
                <DetailPopup day={day} setDay={setDay} close={() => setDay(null)}
                             refresh={() => calendarRef.current!.renderCalendar()}/>}
        </>
    );
}

export default App;
