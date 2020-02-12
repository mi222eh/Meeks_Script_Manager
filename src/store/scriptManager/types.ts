export enum ScriptManagerCommitTypes{
    ADD_LOG= 'addLog',
    SET_SCRIPTS = 'setScripts',
    SET_GROUPS = 'setGroups'
}
export enum ScriptManagerActionTypes{
    EXECUTE_SCRIPT = 'executeScript'
}

export interface ScriptObjectContainer{
    log: string[],
    script: ScriptObject,

}

export interface ScriptObject{
    name:string,
    title:string,
    command:string,
    cwd?: string
}
export interface ScriptGroupObjectContainer{
    log:string[],
    group: ScriptGroupObject
}
export interface ScriptGroupObject{
    name:string,
    scripts:string[],
    title: string
}

export interface ScriptManagerState{
    scriptList: ScriptObjectContainer[],
    groupList: ScriptGroupObjectContainer[]
}

export interface ScriptManagerContext{
    commit(fn: ScriptManagerCommitTypes, payload?:any): void,
    dispatch(fn: ScriptManagerActionTypes, payload?: any): void,
    state: ScriptManagerState
}