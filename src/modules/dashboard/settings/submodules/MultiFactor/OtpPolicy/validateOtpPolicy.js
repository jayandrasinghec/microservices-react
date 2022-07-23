const validate = (values) => {
    const errors = {}

    if (!values.otpType) {
        errors.otpType = 'OTP Type Required'
    }

    if (!values.opthashAlgo) {
        errors.opthashAlgo = 'OTP Hash Algorithm Required'
    }

    if (!values.noOfDigits) {
        errors.noOfDigits = 'Number of Digits Required'
    }

    if (!values.optTokenPeriod) {
        errors.optTokenPeriod = 'OTP Token Period Required'
    }

    if (!values.lookAheadWindow) {
        errors.lookAheadWindow = 'Look Ahead Window Required'
    }

    return errors;
};
export default validate;