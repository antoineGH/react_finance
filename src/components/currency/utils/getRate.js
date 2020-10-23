export default function getRate(outputCurrency, listCurrency) {
    let rate = ''
    listCurrency.forEach(currency => {
        if (currency.value === outputCurrency)
            rate = currency.rate

    })
    return rate
}