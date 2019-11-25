export const DATA_STORED = 'Data has been saved successfully';
export const ERROR_IN_STORED = 'Something is wrong while saving the data';
export const VIRTUAL_ACCOUNT_CREATED = 'Congrats! Your bank has been created';
export const errorMessage = (firstData='',passedData='') => ({
    DATA_STORED: firstData+DATA_STORED+passedData,
    ERROR_IN_STORED:firstData+ERROR_IN_STORED+passedData,
    VIRTUAL_ACCOUNT_CREATED:firstData+VIRTUAL_ACCOUNT_CREATED+passedData
})