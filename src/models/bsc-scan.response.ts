export class BscScanData {
    status?: string;
    message?: string;
    result: any;

    constructor(data?: any) {
        this.status = data.status;
        this.message = data.message;
        this.result = data.result
    }
}
