// Mapping of Persian characters to English equivalents
const persianToEnglishMap = {
    'ا': 'a',
    'آ': 'a',
    'ب': 'b',
    'پ': 'p',
    'ت': 't',
    'ث': 's',
    'ج': 'j',
    'چ': 'ch',
    'ح': 'h',
    'خ': 'kh',
    'د': 'd',
    'ذ': 'z',
    'ر': 'r',
    'ز': 'z',
    'ژ': 'zh',
    'س': 's',
    'ش': 'sh',
    'ص': 's',
    'ض': 'z',
    'ط': 't',
    'ظ': 'z',
    'ع': 'a',
    'غ': 'gh',
    'ف': 'f',
    'ق': 'gh',
    'ک': 'k',
    'گ': 'g',
    'ل': 'l',
    'م': 'm',
    'ن': 'n',
    'و': 'v',
    'ه': 'h',
    'ی': 'y',
    ' ': '-', // Replace spaces with hyphens
};

function generateUsername(name) {
    // Convert Persian characters to English
    let username = name
        .split('')
        .map(char => persianToEnglishMap[char] || char)
        .join('');

    // Replace any non-alphanumeric characters (except hyphens) with an empty string
    username = username.replace(/[^a-z0-9-]/gi, '');

    // Convert to lowercase
    username = username.toLowerCase();

    // Remove leading/trailing hyphens
    username = username.replace(/^-+|-+$/g, '');

    // Replace multiple hyphens with a single hyphen
    username = username.replace(/-+/g, '-');

    return username;
}

module.exports = generateUsername;