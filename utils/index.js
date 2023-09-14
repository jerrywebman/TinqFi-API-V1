export const formatAmount = (value) => {
    const truncate = value.toFixed(8)
    const removeZeros = parseFloat(truncate);;
    return removeZeros;
}