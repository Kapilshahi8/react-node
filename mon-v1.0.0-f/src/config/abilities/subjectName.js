export default function subjectName(item) {
    if (!item || typeof item === 'string') {
        return item
    }

    return item.__type
}
