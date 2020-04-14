import * as childProcess from 'child_process';
import { ChildProcess } from 'child_process';
import {SubEvent} from 'sub-events';



interface ScriptExecutorOptions{
    command:string,
    cwd: string | undefined,
}

interface ScriptExecutorResult{
    output:string,
    error:string
}

interface ScriptExecutionObject{
    process: ChildProcess,
    promise():Promise<ScriptExecutorResult>
}

export function runProcess(opts: ScriptExecutorOptions):ScriptExecutionObject{
    const onError = new SubEvent<Error>();
    const onSuccess = new SubEvent<ScriptExecutorResult>();

    const process = childProcess.spawn(opts.command, [''],{
        cwd: opts.cwd,
        shell: true,
    });
    process.on('close', function(code){
        if(code !== 0){
            onError.emit(new Error(`Process exited with code: ${code}`));
            return;
        }
        onSuccess.emit({
            error: '',
            output: `Process exited with code: ${code}`
        });
    });
    
    const promise: Promise<ScriptExecutorResult> = new Promise((resolve, reject) => {
        onSuccess.subscribe(resolve);
        onError.subscribe(reject);
    });

    return {
        process,
        promise(){
            return promise;
        }
    }
}