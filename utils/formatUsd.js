module.exports = function formatAmountInUsd(value) {
    const truncate = Number(value).toFixed(2)
    return truncate;
}