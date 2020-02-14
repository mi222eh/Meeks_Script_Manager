import './state'
import { ScriptManagerState, ScriptObject, ScriptGroupObject, ScriptObjectContainer} from './types';

export function clearGroupLog(state: ScriptManagerState, payload:{name:string}){
    const script = state.groupList.find(group => group.group.name === payload.name);
    if(!script){
        throw new Error('Group not found')
    }
    script.log = [];
}

export function clearScriptLog(state: ScriptManagerState, payload:{name:string}){
    const script = state.scriptList.find(script => script.script.name === payload.name);
    if(!script){
        throw new Error('Script not found')
    }
    script.log = [];
}

export function addRowToGroupLog(state: ScriptManagerState, payload:{name:string, row:string}){
    const script = state.groupList.find(group => group.group.name === payload.name);
    if(!script){
        throw new Error('Group not found')
    }
    script.log.push(payload.row)
}

export function addRowToScriptLog (state: ScriptManagerState, payload:{name:string, row:string}) {
    const script = state.scriptList.find(script => script.script.name === payload.name);
    if(!script){
        throw new Error('Script not found')
    }
    script.log.push(payload.row)
}

export function addScript(state: ScriptManagerState, script: ScriptObject){
    const container:ScriptObjectContainer = {
        log: [],
        script: script
    }
    state.scriptList.push(container);
}

export function setScripts(state: ScriptManagerState, scripts: ScriptObject[]){
    state.scriptList = scripts.map(script => {
        return{
            log:[],
            script
        }
    });
}

export function setGroups(state: ScriptManagerState, groups: ScriptGroupObject[]){
    state.groupList = groups.map(group => {
        return{
            log:[],
            group
        }
    })
}

export function setGroupScript(state: ScriptManagerState, payload: {name:string, scripts:string[]}){
    const group = state.groupList.find(groupItem => groupItem.group.name === payload.name);
    if(!group){
        throw 'Could not find group';
    }
    group.group.scripts = payload.scripts;
}
