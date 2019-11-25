import {AbilityBuilder} from "@casl/ability";
import {createCanBoundTo} from '@casl/react'
import subjectName from './subjectName'

const ability = AbilityBuilder.define({subjectName}, can => {
    can(['access'], 'account')
    can(['access'], 'dashboard');
    can(['access'], 'dashboard.commerce');

    can(['access'], 'settings');
    can(['access'], 'settings.profile');

    can(['access'], 'transaction');
    can(['access'], 'transaction.terminal');
    can(['access'], 'transaction.ledger');
    can(['access'], 'transaction.batch');
    can(['access'], 'analytics');
    can(['access'], 'analytics.transactionreport');
});

export const ISO = createCanBoundTo(ability)
export const ISO_ABILITY = ability
