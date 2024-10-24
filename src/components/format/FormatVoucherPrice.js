export const formatVoucherPrice = (price) => {
    if (price >= 1000) {
        return (price / 1000).toFixed(0) + 'k';
    }
    return price.toString();
};