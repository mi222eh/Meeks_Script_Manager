import { ScriptManagerState } from './types';
import { getCopy } from '../components/copier';

export function getAllScripts (state: ScriptManagerState) {
    return state.scriptList;
}
export function getScriptCopyById(state: ScriptManagerState){
    return function(id:number){
        const script = state.scriptList.find(item => item.script.id === id);
        if(!script){
            throw 'Cannot find script';
        }
        return getCopy(script.script);
    }
}

export function getScriptById(state: ScriptManagerState){
    return function(id:number){
        console.log('search for', id);
        return state.scriptList.find(item => item.script.id === id);
    }
}
