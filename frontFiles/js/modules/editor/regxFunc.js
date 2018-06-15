'use strict'

const toTag = [
    (str = '') => {
        const regx = /(\*{2}).+?(\*{2})/g;
        return str.replace(regx, (str) => {
            str = str.replace(/(\*{2})/, '<b>');
            return str.replace(/(\*{2})/, '</b>');
        });
    },
    (str = '') => {
        const regx = /(\*{1}).+?(\*{1})/g;
        return str.replace(regx, (str) => {
            str = str.replace(/(\*{1})/, '<i>');
            return str.replace(/(\*{1})/, '</i>');
        });
    },
    (str = '') => {
        const regx = /\[.+?\]\(.+?\)/g;
        return str.replace(regx, (str) => {
            const text = str.match(/\[.+?\]/g)[0].replace(/(\[|\])/g, '');
            const href = str.match(/\(.+?\)/g)[0].replace(/(\(|\))/g, '');
            return `<a href='${href}' target='_blank'>${text}</a>`
        });
    }
];

const toSymbol = [
    (str = '') => {
        const regx = /(<b>).+?(<\/b>)/g;
        return str.replace(regx, (str) => {
            return str.replace(/(<b>|<\/b>)/g, '**');
        });
    },
    (str = '') => {
        const regx = /(<i>).+?(<\/i>)/g;
        return str.replace(regx, (str) => {
            return str.replace(/(<i>|<\/i>)/g, '*');
        });
    },
    (str = '') => {
        const regx = /<a href=('|").+?('|")>.+?<\/a>/g;
        return str.replace(regx, (str) => {
            const text = str.match(/>.+?</g)[0].replace(/(>|<)/g, '');
            const href = str.match(/href=('|").+?('|")/g)[0].replace(/(href=|('|"))/g, '');
            return `[${text}](${href})`
        });
    }
];

export default {
    toSymbol,
    toTag
}