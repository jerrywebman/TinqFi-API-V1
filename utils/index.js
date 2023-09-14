module.exports = function formatAmount(value) {
    const truncate = Number(value).toFixed(8)
    const removeZeros = parseFloat(truncate);
    return removeZeros;
}