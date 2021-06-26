const ErrorBox = (props) => {
    const closeBox = () => {
        props.setDisplayError(false)
    }

    return (
        <div className="error-box-container">
            <div className="error-box">
                <p className="error-text">{props.message}</p>
                <button className="error-close" onClick={() => {closeBox()}}>close</button>
            </div>
        </div>
    )
}

export default ErrorBox;