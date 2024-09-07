import { HttpInterceptorFn } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  req = computed(() => {
    if (accountService.currentUser()) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${accountService.currentUser()?.token}`,
        },
      });
    }
    return req;
  })();

  return next(req);
};
