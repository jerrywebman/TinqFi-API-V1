export const formatAmount = (value) => {
    const truncate = value.toFixed(8)
    const removeZeros = truncate.parseFloat();
    return removeZeros;
}