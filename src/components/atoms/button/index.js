const Button= (props) => {
    const { buttonText, ...rest } = props;
    return (
        <div>
            <button {...rest}>{buttonText}</button>
        </div>
    );
};

export default Button;