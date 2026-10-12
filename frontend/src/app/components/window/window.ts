import { Component, inject, OnInit, signal } from '@angular/core';
import { JobServices } from '../../services/job-services';
import { JobSummary } from '../../models/jobSummary';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-window',
  styleUrl: './window.css',
  templateUrl: './window.html',
})
export class Window implements OnInit {
  private _jobService = inject(JobServices);
  jobs = signal<JobSummary[]>([]);
  isLoading = signal<boolean>(true);
  

  ngOnInit(): void {
    this._jobService.getAll().then((data) => {
      if(!data) console.log("Fail in rendering jobs");
      else this.jobs.set(data);
        
    })
    .catch(error => console.log(error))
    .finally(() => {
      this.isLoading.set(false);
    })
  }
}
