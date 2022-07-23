const validate = (values) => {
    const errors = {}

    if (!values.requiredQuestion) {
        errors.requiredQuestion = 'Questions To Configure Required'
    }

    if (!values.minimumQuestion) {
        errors.minimumQuestion = 'Minimum Correct Questions Required'
    }

    if (values.minimumQuestion && (values.minimumQuestion > values.requiredQuestion)) {
        errors.minimumQuestion = 'Minimum Correct Questions Can not be more than Required Questions'
    }

    return errors;
};
export default validate;