export const formatPrice = (price) => {
    // return `${price}.000đ`
    const newPrice = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `${newPrice}đ`
}