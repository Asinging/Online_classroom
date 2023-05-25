export const useInputImageRenderer = (inputEl, callback) => {
    const inputImageRenderer = () => {
        console.log(inputEl);
        const file = inputEl.value.files[0];
        const reader = new FileReader();

        reader.addEventListener(
            'load',
            () => {
                // callback(reader.result);
                callback(file);
            },
            false
        );

        if (file) {
            reader.readAsDataURL(file);
            return file;
        }
    };
    return {
        inputImageRenderer
    };
};

export const _ = null;