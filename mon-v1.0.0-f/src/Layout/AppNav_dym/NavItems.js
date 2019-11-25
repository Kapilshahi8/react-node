import * as ABILITIES from './../../config/abilities'

export function MainNav() {
    const defaultRole = 'MERCHANT_ABILITY';
    const user_mon_id = localStorage.getItem('user_mon_id');

    let currentRole = defaultRole;
    try {
        currentRole = JSON.parse(localStorage.getItem('userinformation'))['user_metadata']['role'] + '_ABILITY'
    } catch (e) {
        currentRole = defaultRole
    }

    let navItems = [];

    if (ABILITIES[currentRole].can('access', 'virtualterminal')) {
        navItems.push({
            label: 'Virtual Terminal',
            content: [
                {
                    label: 'Terminal',
                    to: '#/VirtualTerminal/virtual-terminal',
                },
                {
                    label: 'Report',
                    to: '#/VirtualTerminal/report',
                },
                // ,
                // {
                //     label: 'JsonReport',
                //     to: '#/VirtualTerminal/json',
                // },
            ],
        })
    }

    if (ABILITIES[currentRole].can('access', 'account')) {
        navItems.push({
            label: 'User Profile',
            to: '#/user/edit',
        })
    }

    if (ABILITIES[currentRole].can('access', 'user.billRates')) {
        navItems.push({
            label: 'Bill Rate',
            to: '#/user/' + user_mon_id + '/billRate',
        })
    }

    if (ABILITIES[currentRole].can('access', 'integrations')) {
        navItems.push({
            label: 'Integrations',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'integrations.api')) {
        navItems.push({
            label: 'API',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'applications')) {
        navItems.push({
            label: 'Applications',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'compliance')) {
        navItems.push({
            label: 'Compliance & Underwriting',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'merchantmanagement')) {
        navItems.push({
            label: 'Merchant Managagment',
            to: '#/apVirtualTerminal/virtual-terminali',
        })
    }

    if (ABILITIES[currentRole].can('access', 'dailyprocessing.recurringbilling')) {
        navItems.push({
            label: 'Recurring Billing',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'partnerportal.agents')) {
        navItems.push({
            label: 'Agents',
            to: '#/VirtualTerminal/virtual-terminal',
        },)
    }

    if (ABILITIES[currentRole].can('access', 'analytics')) {
        navItems.push({
            label: 'Analytics',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'dailyprocessing.settlement')) {
        navItems.push({
            label: 'Settlement',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'partnerportal')) {
        navItems.push({
            label: 'Partner Managagment',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'services')) {
        navItems.push({
            label: 'Dispenserary Services',
            to: '#/VirtualTerminal/virtual-terminal',
        })
    }

    if (ABILITIES[currentRole].can('access', 'partnerportal')) {
        navItems.push({label: 'Account Settings', to: '#/VirtualTerminal/virtual-terminal'})
        navItems.push({label: 'ODFI', to: '#/VirtualTerminal/virtual-terminal'})
    }

    return [
        {
            icon: 'pe-7s-server',
            label: 'Dashboards',
            content: navItems,
        },
    ]
}
