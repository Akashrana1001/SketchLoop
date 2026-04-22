import { useCallback, useState } from 'react';

function markAllTouched(values) {
    return Object.keys(values).reduce((accumulator, key) => {
        accumulator[key] = true;
        return accumulator;
    }, {});
}

export default function useAuthForm({ initialValues, validate, onSubmit }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const handleChange = useCallback(
        (event) => {
            const { name, value, type, checked } = event.target;
            const nextFieldValue = type === 'checkbox' ? checked : value;

            setValues((previousValues) => {
                const nextValues = {
                    ...previousValues,
                    [name]: nextFieldValue,
                };

                if (touched[name]) {
                    setErrors(validate(nextValues));
                }

                return nextValues;
            });
        },
        [touched, validate],
    );

    const handleBlur = useCallback(
        (event) => {
            const { name } = event.target;

            setTouched((previousTouched) => ({
                ...previousTouched,
                [name]: true,
            }));
            setErrors(validate(values));
        },
        [validate, values],
    );

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setSubmitError('');
            setSubmitSuccess('');

            const validationErrors = validate(values);
            setErrors(validationErrors);
            setTouched(markAllTouched(values));

            if (Object.keys(validationErrors).length > 0) {
                return null;
            }

            setIsSubmitting(true);

            try {
                const result = await onSubmit(values);

                if (result?.message) {
                    setSubmitSuccess(result.message);
                }

                return result;
            } catch (error) {
                const fallbackMessage = 'Unable to process this request right now.';
                setSubmitError(error instanceof Error ? error.message : fallbackMessage);
                return null;
            } finally {
                setIsSubmitting(false);
            }
        },
        [onSubmit, validate, values],
    );

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setSubmitError('');
        setSubmitSuccess('');
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        submitError,
        submitSuccess,
        handleChange,
        handleBlur,
        handleSubmit,
        setSubmitError,
        setSubmitSuccess,
        resetForm,
    };
}
