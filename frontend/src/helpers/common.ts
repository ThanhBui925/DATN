export function convertToInt(decimal: any) {
    const intValue = Math.floor(decimal);
    return intValue.toLocaleString('vi-VN');
}

export function convertDate(isoString: string): string {
    const date = new Date(isoString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}
