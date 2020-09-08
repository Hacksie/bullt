import { Action, Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface Stages {
    stages: Stage[]
}

export interface Stage {
    id: number, desc: string, icon: string
}

export const reducer: Reducer<Stages> = (state: Stages | undefined, incomingAction: Action): Stages => {
    if (state === undefined) {
        return { stages: [ {id:0, desc: "New", icon: "opensquare"}, {id:1, desc:"In Progress", icon: "closedsquare"}, {id:2, desc:"Complete", icon: "tick"}] };
    }

    return state;
};
