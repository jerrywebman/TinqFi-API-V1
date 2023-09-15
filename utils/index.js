module.exports = function formatAmount(value) {
    const truncate = Number(value).toFixed(6)
    const removeZeros = parseFloat(truncate);
    return removeZeros;
}