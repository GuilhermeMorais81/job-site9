import { inject, Injectable } from '@angular/core';
import { JobSummary } from '../models/jobSummary';
import { Job } from '../models/job';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from './api';

@Injectable({
    providedIn: "root"
})
export class JobServices {
    private _http = inject(HttpClient)
    async getAll() : Promise<JobSummary[] | null> {
        try {
            return await firstValueFrom(
                this._http.get<JobSummary[]>(`${API_URL}/jobs/get-all`)
            );
        }
        catch(error) {
            return null;
        }
    }
    async search(title : string) : Promise<JobSummary[] | null> {
        try {
            return await firstValueFrom(
                this._http.get<JobSummary[]>(`${API_URL}/jobs/search/title=${encodeURIComponent(title)}`)
            );
        }
        catch(error) {
            return null;
        }
    }
    async getOne(id : string) : Promise<Job | null> {
        try {
            return await firstValueFrom(
                this._http.get<Job>(`${API_URL}/jobs/${id}`)
            );
        }
        catch(error) {
            return null;
        }
    }
}
