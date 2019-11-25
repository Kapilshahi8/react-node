import {AbilityBuilder} from "@casl/ability";
import {createCanBoundTo} from '@casl/react'
import subjectName from './subjectName'

const ability = AbilityBuilder.define({subjectName}, can => {


    can(['access'], 'dashboard');
    can(['access'], 'dashboard.commerce');
    can(['access'], 'transaction');
    can(['access'], 'transaction.terminal');
    can(['access'], 'transaction.batch');

    can(['access'], 'transaction.ledger');
    can(['access'], 'analytics');
    can(['access'], 'analytics.transactionreport');
    can(['access'], 'analytics.transactionLedger');
    can(['access'], 'settings');
    can(['access'], 'settings.compliance');
    can(['access'], 'settings.compliance.webauth');
    can(['access'], 'settings.profile');
    can(['access'], 'settings.rates');
    can(['access'], 'settings.integrations');
    can(['access'], 'settings.api');
    can(['access'], 'settings.applications');

    can(['access'], 'settings.foundingsources');
    can(['access'], 'settings.settlement');
    can(['access'], 'settings.virtualAccount');
    can(['access'], 'bankoptions');


    can(['access'], 'daily');
    can(['access'], 'daily.nacha');
    can(['access'], 'applications');
    can(['access'], 'applications.newmerchant');



    // can(['access'], 'settings.compliance');
    // can(['access'], 'settings.merchant');
    // can(['access'], 'settings.agents');
    // can(['access'], 'settings.analytics');

    // can(['access'], 'settings.partner');
    // can(['access'], 'settings.dispenserary');
    // can(['access'], 'settings.account');
    // can(['access'], 'settings.odfi');

});

export const MERCHANT = createCanBoundTo(ability)
export const MERCHANT_ABILITY = ability
