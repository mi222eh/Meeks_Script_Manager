import { ScriptManagerState } from './types';
import { getCopy } from '../components/copier';

export function getAllScripts (state: ScriptManagerState) {
    return state.scriptList;
}
export function getAllGroups (state: ScriptManagerState) {
    return state.groupList;
}
export function getGroupByName(state: ScriptManagerState){
    return function(name:string){
        return getCopy(state.groupList.find(group => group.group.name === name));
    }
}
export function getScriptByName(state: ScriptManagerState){
    return function(name:string){
        return getCopy(state.scriptList.find(item => item.script.name === name));
    }
}


