import * as Item from './Item';
import * as Stages from './Stages';
import * as Account from './Account';

// The top-level state object
export interface ApplicationState {
    account: Account.AccountState | undefined;
    item: Item.ItemsState | undefined;
    stages: Stages.Stages | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    item: Item.reducer,
    stages: Stages.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
