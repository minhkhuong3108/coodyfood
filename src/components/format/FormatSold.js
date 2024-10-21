export const formatSold = (sold) => {
    if (sold < 1000) return sold.toString();
    if (sold < 1000000) return (sold / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return (sold / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
};