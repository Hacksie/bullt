import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { Stages } from './Stages';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ItemsState {
    isLoading: boolean;
    parentId?: string;
    selectedId?: string;
    items: Item[];
}

export interface Item {
    id: string;
    parentId: string;
    parent: Item | undefined;
    createdDate: string;
    stage: number;
    summary: string;
    indicator: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestItemsAction {
    type: 'REQUEST_ITEMS';
    parentId: string;
}

interface ReceiveItemsAction {
    type: 'RECEIVE_ITEMS';
    parentId: string;
    items: Item[];
    stages: Stages | undefined;
}

export interface SelectedAction { type: 'SELECTED', selectedId: string }

export interface SplitAction { type: 'SPLIT', id: string, start: number, end: number }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestItemsAction | ReceiveItemsAction | SelectedAction | SplitAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestItems: (id: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.item && id !== appState.item.parentId) {
            fetch(`item`)
                .then(response => response.json() as Promise<Item[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_ITEMS', parentId: id, items: data, stages: appState.stages });
                });

            dispatch({ type: 'REQUEST_ITEMS', parentId: id });
        }
    },
    select: (itemId: string) => ({ type: 'SELECTED', selectedId: itemId } as SelectedAction),
    split: (itemId: string, start: number, end: number) => ({ type: 'SPLIT', id: itemId, start: start, end: end } as SplitAction),

};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ItemsState = { items: [], isLoading: false };

export const getNextId = (items: Item[]):string => {
    return (Math.max.apply(Math, items.map(function (o) { return parseInt(o.id) })) + 1).toString();
}

export const hasChildren = (items: Item[], id: string): boolean => {
    return items.some(i => i.parentId === id);
}

export const reducer: Reducer<ItemsState> = (state: ItemsState | undefined, incomingAction: Action): ItemsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case 'REQUEST_ITEMS':
            return {
                parentId: action.parentId,
                selectedId: state.selectedId,
                items: state.items,
                isLoading: true
            };
        case 'RECEIVE_ITEMS':

            if (action.parentId === state.parentId) {
                return {
                    parentId: action.parentId,
                    selectedId: state.selectedId,
                    items: action.items.map(i => {
                        let newItem = {...i};
                        let stage = action.stages ? action.stages.stages.find(s => s.id === i.stage) : undefined;

                        newItem.parent = action.items.find(x => x.id === i.parentId);
                        newItem.indicator = stage ? stage.icon : "circle";
                        return newItem;
                    }),
                    isLoading: false
                };
            }
            break;
        case "SELECTED":
            return {
                parentId: state.parentId,
                selectedId: action.selectedId,
                items: state.items,
                isLoading: false
            }
        case 'SPLIT':
            var newItemState = { ...state };

            newItemState.items = state.items.slice();
            let selectedItem = newItemState.items.find(i => i.id === newItemState.selectedId);
            const newId = getNextId(newItemState.items);

            if (selectedItem) {
                const summary:string = selectedItem.summary;

                const left = summary.slice(0, action.start);
                const right = summary.slice(action.end, summary.length);

                if(hasChildren(newItemState.items, selectedItem.id))
                {
                    const newItem: Item = {
                        parentId: selectedItem.id,
                        id: newId,
                        stage: selectedItem.stage,
                        summary: right,
                        createdDate: selectedItem.createdDate,
                        parent: selectedItem,
                        indicator: selectedItem.indicator
                    }
    
                    selectedItem.summary = left;
                    
                    const newIndex = newItemState.items.findIndex(i => i.parentId === newItem.parentId);
                    newItemState.items.splice(newIndex, 0, newItem);
                    newItemState.selectedId = newId;
                }
                else 
                {
                    const newItem: Item = {
                        parentId: selectedItem.parentId,
                        id: newId,
                        stage: selectedItem.stage,
                        summary: right,
                        createdDate: selectedItem.createdDate,
                        parent: selectedItem.parent,
                        indicator: selectedItem.indicator
                    }
    
                    selectedItem.summary = left;
                    const newIndex = newItemState.items.indexOf(selectedItem) + 1;
                    newItemState.items.splice(newIndex, 0, newItem);
                    newItemState.selectedId = newId;
                }
            }

            return newItemState;
    }

    return state;
};
