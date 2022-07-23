import { PositiveIntegerRegex } from '../../../../../../shared/utility';

const validate = (values) => {
    const errors = {}

    if (!values.noOfDigits) {
        errors.noOfDigits = 'Number of Digits Required'
    }

    if (!values.otpExpiry) {
        errors.otpExpiry = 'OTP expiry Required'
    }

    if (values.otpExpiry && !(values.otpExpiry >= 1 && values.otpExpiry <= 20)) {
        errors.otpExpiry = 'OTP expiry Required'
    }

    if(values.otpExpiry && !PositiveIntegerRegex.test(values.otpExpiry)) {
        errors.otpExpiry = 'Invalid OTP'
    }

    if (!values.otpTemplate) {
        errors.otpTemplate = 'OTP Template Required'
    }

    if (values.otpTemplate) {
        let val = values.otpTemplate.includes('##OTP##');
        if(!val) {
            errors.otpTemplate = 'OTP Template Required'
        }
    }

    if (!values.otpResendTime) {
        errors.otpResendTime = 'OTP Resend Time Required'
    }


    return errors;
};
export default validate;