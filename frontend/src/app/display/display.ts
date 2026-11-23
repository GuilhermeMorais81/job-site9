import { Component, effect, inject, input, signal } from '@angular/core';
import { JobServices } from '../services/job-services';
import { JobSummary } from '../models/jobSummary';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { isRecent, toDate } from '../shared/dates';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-display',
  styleUrl: './display.css',
  templateUrl: './display.html',
})
export class Display {
  private _jobService = inject(JobServices);
  search = input<string>();
  jobs = signal<JobSummary[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  protected readonly isRecent = isRecent;
  protected readonly toDate = toDate;

  constructor() {
    effect(() => {
      this.loadJobs(this.search()?.trim() ?? "");
    });
  }

  private loadJobs(term : string) {
    this.isLoading.set(true);
    this.hasError.set(false);
    const request = term ? this._jobService.search(term) : this._jobService.getAll();
    request.then((data) => {
      if(!data) this.hasError.set(true);
      else this.jobs.set(data);
    })
    .finally(() => {
      this.isLoading.set(false);
    })
  }
}
