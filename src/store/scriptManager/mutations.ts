import './state'
import { ScriptManagerState, ScriptObject, ScriptObjectContainer} from './types';

export function clearScriptLog(state: ScriptManagerState, payload:{id:number}){
    const script = state.scriptList.find(script => script.script.id === payload.id);
    if(!script){
        throw new Error('Script not found')
    }
    script.log = [];
}

export function addRowToScriptLog (state: ScriptManagerState, payload:{id:number, row:string}) {
    const script = state.scriptList.find(script => script.script.id === payload.id);
    if(!script){
        throw new Error('Script not found')
    }
    script.log.push(payload.row)
}

export function addScript(state: ScriptManagerState, script: ScriptObject){
    const container:ScriptObjectContainer = {
        log: [],
        script: script,
        isRunning: false
    }
    state.scriptList.push(container);
}

export function setScripts(state: ScriptManagerState, scripts: ScriptObject[]){
    state.scriptList = scripts.map(script => {
        return{
            log:[],
            script,
            isRunning: false
        }
    });
}

export function updateScript(state: ScriptManagerState, payload:ScriptObject){
    const script = state.scriptList.find(scriptItem => scriptItem.script.id === payload.id);
    if(!script){
        throw 'Could not find script';
    }
    script.script = payload;
}

export function setScriptInProgress(state:ScriptManagerState, payload:{id:number}){
    const script = state.scriptList.find(scriptItem => scriptItem.script.id === payload.id);
    if(!script){
        throw 'Could not find script';
    }
    script.isRunning = true;
}
export function setScriptNotInProgress(state:ScriptManagerState, payload:{id:number}){
    const script = state.scriptList.find(scriptItem => scriptItem.script.id === payload.id);
    if(!script){
        throw 'Could not find script';
    }
    script.isRunning = false;
}
export function removeScript(state:ScriptManagerState, payload:{id:number}){
    state.scriptList = state.scriptList.filter(item => item.script.id !== payload.id);
}
