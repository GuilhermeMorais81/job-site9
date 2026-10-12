import { inject, Injectable } from '@angular/core';
import { JobSummary } from '../models/jobSummary';
import { Job } from '../models/Job';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class JobServices {
    private _http = inject(HttpClient)
    async getAll() : Promise<JobSummary[] | null> {
        try {
            return await firstValueFrom(
                this._http.get<JobSummary[]>("http://localhost:3000/jobs/get-all")
            );
        }
        catch(error) {
            return null;
        }
    }
    async getOne(id : string) : Promise<Job | null> {
        try {
            return await firstValueFrom(
                this._http.get<Job>(`http://localhost:3000/jobs/${id}`)
            );
        }
        catch(error) {
            return null;
        }
    }
}
