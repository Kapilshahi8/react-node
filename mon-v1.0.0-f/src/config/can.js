import * as ABILITIES from './abilities'

const defaultRole = 'MERCHANT'
let currentRole = defaultRole
try {
    currentRole = JSON.parse(localStorage.getItem('userinformation'))['user_metadata']['role']
} catch (e) {
    console.log('0000')
    currentRole = defaultRole
}

export default ABILITIES[currentRole] ? ABILITIES[currentRole] : ABILITIES[defaultRole]

