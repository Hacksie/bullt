import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AccountState {
    token: Token;
}
export interface LoginRequest {
    username: string,
    password: string;
}

export interface Token {
    token: string;
    tokenExpiration: Date;
}

interface RequestTokenAction {
    type: 'REQUEST_TOKEN';
    username:string,
    password:string
}

interface ReceiveTokenAction {
    type: 'RECEIVE_TOKEN';
    token:string;
    tokenExpiration:Date;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestTokenAction | ReceiveTokenAction;


export const actionCreators = {
    requestToken: (loginRequest: LoginRequest): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.account && (appState.account.token === undefined || appState.account.token.tokenExpiration <= new Date())) {
            fetch(`createToken`)
                .then(response => response.json() as Promise<Token>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_TOKEN', token: data.token, tokenExpiration: data.tokenExpiration });
                });

            dispatch({ type: 'REQUEST_TOKEN', username: loginRequest.username, password: loginRequest.password});
             
        }
    },
};