import getRate from './getRate'

export default function toCurrency(inputValue, outputCurrency, listCurrency) {
    inputValue = parseFloat(inputValue);
    if (Number.isNaN(inputValue)) {
        return '';
    }

    const rate = getRate(outputCurrency, listCurrency);
    const output = inputValue * rate
    if (output === 0) return 1
    const rounded = Math.round(output * 10000) / 10000;
    return rounded.toString();
}