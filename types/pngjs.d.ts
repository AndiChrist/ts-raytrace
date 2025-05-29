// types/pngjs.d.ts
declare module "pngjs" {
    import { Writable } from "stream";

    export interface PNGOptions {
        width: number;
        height: number;
    }

    export class PNG extends Writable {
        width: number;
        height: number;
        data: Buffer;

        constructor(options: PNGOptions);
        pack(): Writable;
    }
}
