import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { projectRequestDetailedResolver } from './project-request-detailed.resolver';

describe('projectRequestDetailedResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => projectRequestDetailedResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
