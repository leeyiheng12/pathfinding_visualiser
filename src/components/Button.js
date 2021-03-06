import React from "react";
import classes from "./Button.module.css";


const Button = props => {

    const height = props.height ? props.height : "6vh";
    const width = props.width ? props.width : "6vw";

    const buttonStyle = {
        "width": width,
        "height": height,
        "border": props.border,
    }

    return (<div className={
            `${props.hidden ? classes.hidden : ""} 
            ${classes.buttonClass} 
            ${props.selected ? classes.selected : ""}
            ${props.disabled ? classes.disabled : ""}`}
        style={buttonStyle} 
        onClick={props.onClick}>

            {props.value}

        </div>);
}

export default Button;