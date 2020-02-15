export enum ScriptManagerCommitTypes{
    ADD_LOG= 'addLog',
    ADD_GROUP = 'addGroup',
    SET_SCRIPTS = 'setScripts',
    SET_GROUPS = 'setGroups',
    CLEAR_GROUP_LOG = 'clearGroupLog',
    CLEAR_SCRIPT_LOG = 'clearScriptLog',
    ADD_ROW_TO_GROUP_LOG = 'addRowToGroupLog',
    ADD_ROW_TO_SCRIPT_LOG = 'addRowToScriptLog',
    SET_SCRIPTS_TO_GROUP = 'setGroupScript',
    ADD_SCRIPT = 'addScript',
    UPDATE_GROUP = 'updateGroup',
    UPDATE_SCRIPT = 'updateScript',
    SET_GROUP_IN_PROGRESS = 'setGroupInProgress',
    SET_SCRIPT_IN_PROGRESS = 'setScriptInProgress',
    SET_GROUP_NOT_IN_PROGRESS = 'setGroupNotInProgress',
    SET_SCRIPT_NOT_IN_PROGRESS = 'setScriptNotInProgress',
    REMOVE_GROUP = 'removeGroup',
    REMOVE_SCRIPT = 'removeScript'
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
    isRunning: boolean,
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
    isRunning: boolean,
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