export function formatAmount(str, type) {
    let num = parseFloat(str) * 100
    if (type === 'number') {
        return num
    } else return num.toString()
}

export function formatCurrency(number, dp, currencySign = '₦') {
    if (typeof number === 'string' && /^\d+$/.test(number)) {
        number = Number(number)
    }
    if (typeof number !== 'number' || isNaN(number)) {
        return 'Error: Invalid input'
    }
    let formattedNumber = Number(number).toFixed(dp)
    let parts = formattedNumber.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    let formattedString = `${currencySign}${parts.join('.')}`

    return formattedString
}

export const capitalize = (str) => {
    if (!str) return '----'
    else
        return str
            ?.toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
}
