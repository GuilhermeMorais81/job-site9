import { TestBed } from '@angular/core/testing';
import { JobServices } from './job-services';

describe('JobServices', () => {
  let service: JobServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
