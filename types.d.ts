import { Connection } from "mongoose";

declare global{
    var monogoose:{
        conn:Connection | null;
        promise :Promise<Connection> | nul;
    }
}

export {}