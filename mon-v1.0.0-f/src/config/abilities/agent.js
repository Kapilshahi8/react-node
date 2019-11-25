import {AbilityBuilder} from "@casl/ability";
import {createCanBoundTo} from '@casl/react'
import subjectName from './subjectName'

const ability = AbilityBuilder.define({subjectName}, can => {
    can(['access'], 'dashboard');
    can(['access'], 'dashboard.commerce');
    // can(['access'], 'transaction');
    // can(['access'], 'transaction.terminal');
    // can(['access'], 'transaction.batch');
    // can(['access'], 'analytics');
    // can(['access'], 'analytics.transactionreport');

    can(['access'], 'settings');
    can(['access'], 'settings.profile');
    // can(['access'], 'settings.rates');
    // can(['access'], 'settings.integrations');
    // can(['access'], 'settings.api');
    // can(['access'], 'settings.applications');

    can(['access'], 'settings.foundingsources');
    can(['access'], 'settings.settlement');
    can(['access'], 'bankoptions');
    can(['access'], 'settings');
    can(['access'], 'settings.compliance');
    can(['access'], 'settings.compliance.webauth');

});

export const AGENT = createCanBoundTo(ability)
export const AGENT_ABILITY = ability
