import { string } from "prop-types";

export const submitvalue = {
    customerInformation: {
        "companyName": string,
        "customerName": string, 
        "customerPhone": string,
        "customerEmail": string,
        "address1": string,
        "address2": string,
        "city": string,
        "stateProvince": string,
        "zipCode": string,
        "last_4ssn": string
    },
    paymentInformation: {
        "accountNumber": string,
        "routingNumber": string, 
        "accountType": string
    },
    billingInformation: {
        "transactType": string,
        "retryAmount": string, 
        "initialAmount": string,
        "recurringAmount": string,
        "numofdaysRecurredBillings": string,
        "maxnumofBillings": string,
        "billingCycle": string,
        "futureInitialDate": string
    },
    otherInformation: {
        "orderdCustomerName": string,
        "customerComment": string
    }
}