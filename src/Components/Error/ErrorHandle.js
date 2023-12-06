export function isErrorInputForm(errors, name) {
    const isError = errors.find((error) => error.field === name)
    if (isError) return true
    return false
}

export function errorMessageFormInput(errors, name) {
    if (isErrorInputForm(errors, name)) {
        return errors.filter((item) => item.field === name)[0].message
    }
}