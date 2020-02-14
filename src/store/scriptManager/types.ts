export enum ScriptManagerCommitTypes{
    ADD_LOG= 'addLog',
    SET_SCRIPTS = 'setScripts',
    SET_GROUPS = 'setGroups',
    CLEAR_GROUP_LOG = 'clearGroupLog',
    CLEAR_SCRIPT_LOG = 'clearScriptLog',
    ADD_ROW_TO_GROUP_LOG = 'addRowToGroupLog',
    ADD_ROW_TO_SCRIPT_LOG = 'addRowToScriptLog',
    SET_SCRIPTS_TO_GROUP = 'setGroupScript',
    ADD_SCRIPT = 'addScript',
    UPDATE_GROUP = 'updateGroup'
}
export enum ScriptManagerActionTypes{
    EXECUTE_SCRIPT = 'executeScript',
    EXECUTE_GROUP = 'executeGroupScript',
    UPDATE_SCRIPT = 'updateScript',
    UPDATE_GROUP = 'updateGroup',
    LOAD_SCRIPTS = 'loadScripts',
    CREATE_SCRIPT = 'createScript'
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