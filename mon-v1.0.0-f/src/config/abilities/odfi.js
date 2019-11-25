import {AbilityBuilder} from "@casl/ability";
import {createCanBoundTo} from '@casl/react'
import subjectName from './subjectName'

const ability = AbilityBuilder.define({subjectName}, can => {
    can(['access'], 'dashboard');
    can(['access'], 'dashboard.commerce');
    can(['access'], 'settings');
    can(['access'], 'settings.compliance');
    can(['access'], 'settings.compliance.webauth');
    can(['access'], 'settings.profile');
});

export const ODFI = createCanBoundTo(ability)
export const ODFI_ABILITY = ability
