import {ChangeEvent, useState} from "react";
import {MonthData, MonthList, RemoveMonth, Reset} from "../../utils/LocalStorageManager";

interface Props {
    title: string,
    subTitle: string,
    setTitles: (title: string, subTitle: string) => void,
    refresh: () => void,
    close: () => void
}

export const SettingPopup = (props: Props) => {
    const [title, setTitle] = useState(props.title);
    const [subTitle, setSubTitle] = useState(props.subTitle);
    const [monthList, setMonthList] = useState<MonthData[]>(MonthList());

    const changeTitle = (event: ChangeEvent) => {
        const target = event.target as HTMLInputElement;

        if (target.id === "titleInput") {
            setTitle(target.value);
        } else {
            setSubTitle(target.value);
        }
    }

    const isChanged = () => {
        return title !== props.title || subTitle !== props.subTitle;
    }

    const removeMonthData = (monthData: MonthData) => {
        RemoveMonth(monthData.year, monthData.month);
        setMonthList(monthList.filter(month => month !== monthData));
        props.refresh();
    }

    const resetData = () => {
        setMonthList([]);
        Reset();
        window.location.reload();
    }

    return (
        <div className="settings-modal" id="settingsModal">
            <div className="settings-modal-content">
                <div className="settings-header">
                    <h2>⚙️ 설정</h2>
                    <button onClick={() => props.close()} className="close-btn">&times;</button>
                </div>
                <div className="settings-body">
                    <div className="settings-section">
                        <h3>📝 제목 설정</h3>
                        <input value={title} type="text" onChange={changeTitle} id="titleInput"
                               className="settings-input"
                               placeholder="메인 타이틀을 입력하세요"/>
                        <input value={subTitle} type="text" onChange={changeTitle} id="subTitleInput"
                               className="settings-input"
                               placeholder="서브 타이틀을 입력하세요"/>
                        <button onClick={() => props.setTitles(title, subTitle)} disabled={!isChanged()}
                                className={`settings-btn apply-btn ${isChanged() && 'active'}`}>적용
                        </button>
                    </div>

                    <div className="settings-section">
                        <h3>🗓️ 월별 데이터 관리</h3>
                        <div className="month-list" id="monthList">
                            {monthList.map(month => {
                                return (
                                    <div key={month.month} className="month-item">
                                        <div className="month-info">
                                            <span className="month-name">{`${month.year}년 ${month.month}월`}</span>
                                            <button onClick={() => removeMonthData(month)} className="month-delete-btn">
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="settings-section">
                        <h3>🚨 전체 초기화</h3>
                        <button onClick={() => resetData()} className="settings-btn danger-btn">초기화</button>
                    </div>
                </div>
            </div>
        </div>
    )
}