export const formatRating = (rating) => {
    return Number.isInteger(rating) ? `${rating}.0` : rating.toFixed(1);
};