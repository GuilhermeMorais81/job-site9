import { Component, inject, input, OnInit, signal } from '@angular/core';
import { JobServices } from '../services/job-services';
import { Job } from '../models/job';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { isRecent, toDate } from '../shared/dates';

@Component({
  imports: [DatePipe, DecimalPipe, RouterLink],
  selector: 'app-detail',
  styleUrl: './detail.css',
  templateUrl: './detail.html',
})
export class Detail implements OnInit {
  private _jobService = inject(JobServices);
  private _title = inject(Title);
  id = input.required<string>();
  job = signal<Job | null>(null);
  isLoading = signal<boolean>(true);
  protected readonly isRecent = isRecent;
  protected readonly toDate = toDate;

  ngOnInit(): void {
    this._jobService.getOne(this.id())
      .then(data => {
        this.job.set(data);
        if (data) this._title.setTitle(`${data.title} at ${data.company.name} · Workwise`);
      })
      .finally(() => this.isLoading.set(false));
  }
}
