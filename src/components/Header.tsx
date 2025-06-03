import React, {useEffect, useState} from "react";
import {SettingPopup} from "./popup/SettingPopup";
import {DEFAULT} from "../config/Default";

interface Props {
    refresh: () => void
}

export const Header = (props: Props) => {
    const [isVisibleSettingPopup, setVisibleSettingPopup] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [subTitle, setSubTitle] = useState<string>("");

    useEffect(() => {
        const savedTitle = localStorage.getItem("title");
        const savedSubTitle = localStorage.getItem("subTitle");

        if (savedTitle) {
            setTitle(savedTitle);
            setSubTitle(savedSubTitle!);
        } else {
            localStorage.setItem("title", DEFAULT.TITLE);
            localStorage.setItem("subTitle", DEFAULT.SUBTITLE);

            setTitle(DEFAULT.TITLE);
            setSubTitle(DEFAULT.SUBTITLE);
        }

    }, []);

    const setTitles = (title: string, subTitle: string) => {
        setTitle(title);
        setSubTitle(subTitle);
        localStorage.setItem("title", title);
        localStorage.setItem("subTitle", subTitle);
    }

    return (
        <div className="header">
            <h1>{title}</h1>
            <p>{subTitle}</p>
            <button onClick={() => setVisibleSettingPopup(!isVisibleSettingPopup)} className="settings-btn">설정</button>

            {isVisibleSettingPopup && <SettingPopup title={title} subTitle={subTitle} setTitles={setTitles}
                                                    close={() => setVisibleSettingPopup(false)}
                                                    refresh={() => props.refresh()}/>}
        </div>
    )
}