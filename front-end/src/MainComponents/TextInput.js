const TextInput = (props) => {
    return (
        <input value={props.text} onChange={(event) => {props.onTextInput(event)}}></input>
    )
}

export default TextInput;