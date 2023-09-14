module.exports = function formatAmount(value) {
    console.log(value);
    const truncate = Number(value).toFixed(8)
    const removeZeros = parseFloat(truncate);
    return removeZeros;
}