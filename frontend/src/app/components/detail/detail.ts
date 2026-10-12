import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { JobServices } from '../../services/job-services';
import { Job } from '../../models/Job';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-detail',
  styleUrl: './detail.css',
  templateUrl: './detail.html',
})
export class Detail implements OnInit {
  @Input() id! : string;
  ngOnInit(): void {
    this._jobService.getOne(this.id).then(data => {
      if(!data) console.log("unable to get the job");
      else this.job.set(data);

    })
  }
  private _jobService = inject(JobServices);
  private job = signal<Job | null>(null);

}
