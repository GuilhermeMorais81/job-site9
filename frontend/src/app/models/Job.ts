export interface Job {
    id : string;
    company : { id : string; name : string };
    title : string;
    description : string;
    salary : number;
    createdAt : Date;
}
