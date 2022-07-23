const minScore = min => value => value && value < min ? `Minimum Score must be at least ${min}` : undefined
const maxScore = max => value => value && value > max ? `Max Score should be less than ${max}` : undefined
const minScore20 = minScore(20)
const maxScore100 = maxScore(100)
const validate = (values) => {
    const errors = {}

    if (!values.ruleName) {
        errors.ruleName = 'Name Required'
    }

    if (!values.description) {
        errors.description = 'Description Required'
    }

    if (!values.type) {
        errors.type = 'Type Required'
    }

    if ( values.isAdaptive && !values.adaptiveScore ){
        errors.adaptiveScore = 'Adaptive Score Required'
    }

    if ( values.isAdaptive && values.adaptiveScore > 100 )
    {
        errors.adaptiveScore = 'Adaptive Score cannot be more than 100'
    }

    if ( values.isAdaptive && values.adaptiveScore < 20 )
    {
        errors.adaptiveScore = 'Adaptive Score cannot be less than 20'
    }

    return errors;
};
export default validate;