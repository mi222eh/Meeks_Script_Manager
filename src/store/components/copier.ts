export function getCopy(obj: any): any{
    try{
        return JSON.parse(JSON.stringify(obj));
    }
    catch{
        return null;
    }
}