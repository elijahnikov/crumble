const uncamelize = (text: string): string => {
    const words = text
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert a space before uppercase letters
        .toLowerCase() // Convert the entire string to lowercase
        .split(" ");

    if (words.length > 0 && words[0]) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }

    return words.join(" ");
};

export default uncamelize;
