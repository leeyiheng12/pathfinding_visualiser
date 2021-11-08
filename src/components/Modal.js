import ReactDOM from "react-dom";

// import Button from "./Button";
import classes from "./Modal.module.css";

const Backdrop = props => {
    return <div className={classes.backdrop} onClick={props.onConfirm}></div>;
};

const ModalOverlay = props => {

    const message = `
    Click on a grid square to set the start and end points. \n
    Start -> Green \n
    End -> Red \n
    Wall -> Black \n
    To reset a grid square, click on it again.  \n
    You can also left-click and drag to draw walls quickly, or right-click and drag to delete walls quickly. 
    Hint: Zoom out all the way if you want the grids to look different.
    `;

    const sliderHandler = e => {
        props.setSpeed(e.target.value);
    }

    return (
        <div className={classes.modal}>
            <header className={classes.header}>
                <h2>
                    {props.title}
                </h2>
            </header>
            <div className={classes.content}>
                {message.split("\n").map(x => <p key={Math.random()}>{x}</p>)}
                <p>Speed</p>
                <input className={classes.slider} type="range" min="1" max="10" value={props.speed} onInput={sliderHandler} />
                <p onClick={e => window.open("https://github.com/leeyiheng12/pathfinding_visualiser")}>
                    <u>GitHub</u>
                </p>
            </div>
            {/* <footer className={classes.actions}>
                <Button onClick={props.onConfirm}>Ok!</Button>
            </footer> */}
        </div>
    );
};

const Modal = props => {
    return (
        <>
            {ReactDOM.createPortal(<Backdrop onConfirm={props.onConfirm} />, document.getElementById("backdrop-root"))}
            {ReactDOM.createPortal(<ModalOverlay 
                title={props.title} 
                message={props.message} 
                onConfirm={props.onConfirm}
                speed={props.speed}
                setSpeed={props.setSpeed} />, document.getElementById("overlay-root"))}
        </>
    );
};

export default Modal;