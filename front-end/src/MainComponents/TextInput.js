/*
TEXT INPUT COMPONENT
allows for react friendly text input
*/

const TextInput = (props) => {
    return (
        <input value={props.text} onChange={(event) => {props.onTextInput(event)}}></input>
    )
}

export default TextInput;