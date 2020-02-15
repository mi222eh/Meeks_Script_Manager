import './state'
import { ScriptManagerState, ScriptObject, ScriptGroupObject, ScriptObjectContainer, ScriptGroupObjectContainer} from './types';

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

export function addGroup(state: ScriptManagerState, group: ScriptGroupObject){
    const container: ScriptGroupObjectContainer = {
        group: group,
        log:[],
        isRunning: false
    }
    state.groupList.push(container);
}

export function updateScript(state: ScriptManagerState, payload:ScriptObject){
    const script = state.scriptList.find(scriptItem => scriptItem.script.name === payload.name);
    if(!script){
        throw 'Could not find script';
    }
    script.script = payload;
}
export function setGroups(state: ScriptManagerState, groups: ScriptGroupObject[]){
    state.groupList = groups.map(group => {
        return{
            log:[],
            group,
            isRunning: false
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

export function updateGroup(state: ScriptManagerState, payload:ScriptGroupObject){
    const group = state.groupList.find(groupItem => groupItem.group.name === payload.name);
    if(!group){
        throw 'Could not find group';
    }
    group.group = payload;
}

export function setGroupInProgress(state:ScriptManagerState, payload:{name:string}){
    const group = state.groupList.find(groupItem => groupItem.group.name === payload.name);
    if(!group){
        throw 'Could not find group';
    }
    group.isRunning = true;
}

export function setScriptInProgress(state:ScriptManagerState, payload:{name:string}){
    const script = state.scriptList.find(scriptItem => scriptItem.script.name === payload.name);
    if(!script){
        throw 'Could not find script';
    }
    script.isRunning = true;
}

export function setGroupNotInProgress(state:ScriptManagerState, payload:{name:string}){
    const group = state.groupList.find(groupItem => groupItem.group.name === payload.name);
    if(!group){
        throw 'Could not find group';
    }
    group.isRunning = false;
}
export function setScriptNotInProgress(state:ScriptManagerState, payload:{name:string}){
    const script = state.scriptList.find(scriptItem => scriptItem.script.name === payload.name);
    if(!script){
        throw 'Could not find script';
    }
    script.isRunning = false;
}

export function removeGroup(state:ScriptManagerState, payload:{name:string}){
    state.groupList = state.groupList.filter(item => item.group.name !== payload.name);
}
export function removeScript(state:ScriptManagerState, payload:{name:string}){
    state.groupList.forEach(item => {
        item.group.scripts = item.group.scripts.filter(script => script !== payload.name);
    })
    state.scriptList = state.scriptList.filter(item => item.script.name !== payload.name);
}
