import { ScriptManagerState } from './types';

export function getAllScripts (state: ScriptManagerState) {
    return state.scriptList;
}
export function getAllGroups (state: ScriptManagerState) {
    return state.groupList;
}
export function getGroupByName(state: ScriptManagerState){
    return function(name:string){
        return state.groupList.find(group => group.group.name === name);
    }
}


