const removeUndefinedProperties = <T extends object>(obj: T): Partial<T> => {
    const filtered: Partial<T> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
            filtered[key] = obj[key];
        }
    }

    return filtered;
};

export default removeUndefinedProperties;
