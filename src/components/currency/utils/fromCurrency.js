import getRate from './getRate'

export default function fromCurrency(outputValue, outputCurrency, listCurrency) {
    outputValue = parseFloat(outputValue);
    if (Number.isNaN(outputValue)) {
        return '';
    }
    const rate = getRate(outputCurrency, listCurrency);
    const output = outputValue / rate
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}