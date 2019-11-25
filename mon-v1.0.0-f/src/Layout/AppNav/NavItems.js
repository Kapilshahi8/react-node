import * as ABILITIES from './../../config/abilities'

const defaultRole = 'MERCHANT_ABILITY';
const user_mon_id = localStorage.getItem('user_mon_id');


let currentRole = defaultRole;
try {
    currentRole = JSON.parse(localStorage.getItem('userinformation'))['user_metadata']['role'] + '_ABILITY'
} catch (e) {
    currentRole = defaultRole
}


function getDashBoardItems() {

    const dbI = [];
    if (ABILITIES[currentRole].can('access', 'dashboard.commerce')) {
        dbI.push({
            label: 'Commerce',
            to: '#/dashboards/commerce',
        })
    }

    return {
        icon: 'pe-7s-monitor',
        label: 'Dashboard',
        content: dbI,
    }
}

function getTransactionItems() {

    const trI = []
    if (ABILITIES[currentRole].can('access', 'transaction.terminal')) {
        trI.push({
            label: 'Virtual Terminal',
            to: '#/analytics/virtual-terminal',
        })
    }
    if (ABILITIES[currentRole].can('access', 'transaction.batch')) {
        trI.push({
            label: 'Batch Upload',
            to: '#/analytics/virtual-terminal',
        })
    }


    return {
        icon: 'lnr-sync',
        label: 'Transactions',
        content: trI
    }
}

function getAnalitycsItems() {

    const analIt = []
    if (ABILITIES[currentRole].can('access', 'analytics.transactionreport')) {
        analIt.push({
                label: 'Transaction',
                to: '#/analytics/transaction'
            }
        )
    }
    if (ABILITIES[currentRole].can('access', 'analytics.transactionLedger')) {
        analIt.push({
            label: 'Transaction Ledger',
            to: '#/transaction-ledger'
        })
    }
    return {
        icon: 'pe-7s-plugin',
        label: 'Analytics',
        content: analIt,
    }
}

function getApplications() {
    const settIt = [];

    if (ABILITIES[currentRole].can('access', 'applications.newmerchant')) {
        settIt.push({
            label: 'New Merchant Application',
            to: '#/applications/newmerchant',
        })
    }

    return {
        icon: 'pe-7s-keypad',
        label: 'Applications',
        content: settIt,
    }
}

function getSettingsItems() {

    const settIt = [];

    if (ABILITIES[currentRole].can('access', 'settings.profile')) {
        settIt.push({
            label: 'Profile Update',
            to: '#/user/edit',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.rates')) {
        settIt.push({
            label: 'Bill Rate',
            to: '#/user/' + user_mon_id + '/billRate',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.integrations')) {
        settIt.push({
            label: 'Integrations',
            to: '#/integrations/',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.api')) {
        settIt.push({
            label: 'API',
            to: '#/analytics/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.applications')) {
        settIt.push({
            label: 'Applications',
            to: '#/analytics/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.merchant')) {
        settIt.push({
            label: 'Merchant Managagment',
            to: '#/apanalytics/virtual-terminali',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.recurring')) {
        settIt.push({
            label: 'Recurring Billing',
            to: '#/analytics/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.agents')) {
        settIt.push({
            label: 'Agents',
            to: '#/analytics/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.analytics')) {
        settIt.push({
            label: 'Analytics',
            to: '#/analytics/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.partner')) {
        settIt.push({
            label: 'Partner Managagment',
            to: '#/analytics/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.dispenserary')) {
        settIt.push({
            label: 'Dispenserary Services',
            to: '#/analytics/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.account')) {
        settIt.push({
            label: 'Account Settings',
            to: '#/analytics/virtual-terminal'
        })
    }

    if (ABILITIES[currentRole].can('access', 'settings.odfi')) {
        settIt.push({
            label: 'ODFI',
            to: '#/analytics/virtual-terminal'
        })
    }

    return {
        icon: 'pe-7s-config',
        label: 'Setting',
        content: settIt,
    }
}

function getBankItems() {
    const boI = [];

    if (ABILITIES[currentRole].can('access', 'settings.foundingsources')) {
        boI.push({
            label: 'Funding Source',
            to: '#/funding-sources/',
        })
    }
    if (ABILITIES[currentRole].can('access', 'settings.settlement')) {
        boI.push({
            label: 'Transfer',
            to: '#',
        })
    }
    //virtual account access
    if (ABILITIES[currentRole].can('access', 'settings.virtualAccount')) {
        boI.push({
            label: 'Virtual Accounts',
            to: '#/virtual-account',
        })
    }

    return {
        icon: 'pe-7s-cash',
        label: 'Banking',
        content: boI
    }
}

function getDailyItems() {
    const daI = [];

    if (ABILITIES[currentRole].can('access', 'daily.nacha')) {
        daI.push({
            label: 'NACHA File',
            to: '#/nacha/',
        })
    }

    return {
        icon: 'lnr-cloud-sync',
        label: 'Daily Processing ',
        content: daI
    }
}

function getcomplianceItems() {
    let somItm = []

    if (ABILITIES[currentRole].can('access', 'settings.compliance.webauth')) {
        somItm.push({
            label: 'Web Authorization',
            to: '#/web-authorization',
        })
    } else {
        somItm = null
    }

    return {
        label: 'Compliance', //& Underwriting
        icon: 'lnr-cloud-sync',
        content: somItm
    }
}

//lnr-home

const MainNavData = []

if (ABILITIES[currentRole].can('access', 'dashboard')) {
    MainNavData.push(getDashBoardItems())
}
if (ABILITIES[currentRole].can('access', 'transaction')) {
    MainNavData.push(getTransactionItems())
}
if (ABILITIES[currentRole].can('access', 'bankoptions')) {
    MainNavData.push(getBankItems())
}

if (ABILITIES[currentRole].can('access', 'daily')) {
    MainNavData.push(getDailyItems())
}


if (ABILITIES[currentRole].can('access', 'analytics')) {
    MainNavData.push(getAnalitycsItems())
}

if (ABILITIES[currentRole].can('access', 'settings')) {
    MainNavData.push(getSettingsItems())
}

if (ABILITIES[currentRole].can('access', 'applications')) {
    MainNavData.push(getApplications())
}

if (ABILITIES[currentRole].can('access', 'settings.compliance')) {
    MainNavData.push(getcomplianceItems())
}

export const MainNav = MainNavData

