import momentTime from 'moment-business-time'

export default function getBusinessDateTime(date) {
    if (!date) return null
    momentTime.locale('en', {
        workinghours: {
            0: null,
            1: ['09:00:00', '16:00:00'],
            2: ['09:00:00', '16:00:00'],
            3: ['09:00:00', '16:00:00'],
            4: ['09:00:00', '16:00:00'],
            5: ['09:00:00', '16:00:00'],
            6: null
        }
    });
    return new Date(momentTime(date).nextWorkingTime())
}
