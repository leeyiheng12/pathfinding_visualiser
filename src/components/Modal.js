import ReactDOM from "react-dom";

// import Button from "./Button";
import classes from "./Modal.module.css";

const Backdrop = props => {
    return <div className={classes.backdrop} onClick={props.onConfirm}></div>;
};

const ModalOverlay = props => {
    return (
        <div className={classes.modal}>
            <header className={classes.header}>
                <h2>
                    {props.title}
                </h2>
            </header>
            <div className={classes.content}>
                <p>
                    {props.message.split("\n").map(x => <p>{x}</p>)}
                </p>
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
            {ReactDOM.createPortal(<ModalOverlay title={props.title} message={props.message} onConfirm={props.onConfirm}/>, document.getElementById("overlay-root"))}
        </>
    );
};

export default Modal;