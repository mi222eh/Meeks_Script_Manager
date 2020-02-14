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
        return state.groupList.find(group => group.group.name === name);
    }
}
export function getScriptCopyByName(state: ScriptManagerState){
    return function(name:string){
        const script = state.scriptList.find(item => item.script.name === name);
        if(!script){
            throw 'Cannot find script';
        }
        return getCopy(script.script);
    }
}

export function getScriptByName(state: ScriptManagerState){
    return function(name:string){
        return state.scriptList.find(item => item.script.name === name);
    }
}
export function getGroupCopyByName(state: ScriptManagerState){
    return function(name:string){
        const group = state.groupList.find(group => group.group.name === name)
        if(!group){
            throw 'Cannot find group';
        }
        return getCopy(group.group);
    }
}


