interface Props {
    content: string;
    click: () => void;
}

export const Banner = (props: Props) => {
    return (
        <div className="banner-container">
            <span>{props.content}</span>
            <button onClick={() => props.click()}>종료</button>
        </div>
    )
}