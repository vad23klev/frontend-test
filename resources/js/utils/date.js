export function formatDateForApi(dateString) {
    const [day, month, year, hours, minutes] = dateString.match(/\d+/g).map(Number)

    return new Date(
        year,
        month - 1,
        day,
        hours,
        minutes
    ).toISOString()
}


export function getCurrentDateTime() {
    const date = new Date()

    const pad = value => String(value).padStart(2, '0')

    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
