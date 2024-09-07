import { TestBed } from '@angular/core/testing';

import { SoftwareCompanyService } from './software-company.service';

describe('SoftwareCompanyService', () => {
  let service: SoftwareCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftwareCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
