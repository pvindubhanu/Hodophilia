import { React, useState } from "react";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect } from "react";

import Styles from './css/list-itinerarySelect.module.css'

function EditableField({tag, editable}) {

    const [isEditMode, setEditMode] = useState(false);
    const [tempText, setTempText] = useState("");

    useEffect(() => {
        setTempText(editable.initialValue)
    }, [editable]);

    function handleFormInput(e) {
        let text = e.target.value;
        console.log(text);
        setTempText(text);
    }

    function editModeToggle(confirmed) {
        if (isEditMode) {
            if (confirmed) {
                let filteredValue = "";
                (tempText === "") ? filteredValue = "No name" : filteredValue = tempText;
                editable.setValue(filteredValue);
            }
            if (editable.executeAfterEdit) editable.executeAfterEdit();
        } 
        setEditMode(!isEditMode);
    }

    function textWeightWrapper(children) {
        switch(tag) {
            case 'h1':
                return (<h1>{children}</h1>);
            case 'h2':
                return (<h2>{children}</h2>);
            case 'h3':
                return (<h3>{children}</h3>);
            case 'h4':
                return (<h4>{children}</h4>);
            case 'h5':
                return (<h5>{children}</h5>);
            case 'h6':
                return (<h6>{children}</h6>);
            case 'span':
                return (<span>{children}</span>);
            default:
                return (<p>{children}</p>)
        }
    }

    // function edit

    return textWeightWrapper(
        <>
            {
                (
                    (isEditMode) && (
                        <input type="text" value={tempText} onInput={handleFormInput} class={Styles["input"]} ></input>
                    )
                ) 
                ||
                (
                    <>
                        {editable.initialValue}
                    </>
                )
            }
            {
                (isEditMode && (
                    <>
                    <button className={Styles['icon']} onClick={() => editModeToggle(true)}>
                        <CheckOutlined />
                    </button>
                    <button className={Styles['icon']} onClick={() => editModeToggle(false)}>
                        <CloseOutlined />
                    </button>
                    </>
                )) 
                ||
                (
                    <button className={Styles['icon']} onClick={editModeToggle}>
                        <EditOutlined />
                    </button>
                )
            }
        </>
    );
}

export default EditableField;