export const formatVoucher = (voucher) => {
    if (voucher >= 1000) {
        return (voucher / 1000) + 'k';
    }
    return voucher.toString();
}