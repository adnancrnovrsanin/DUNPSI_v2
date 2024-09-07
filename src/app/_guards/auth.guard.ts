import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const user = accountService.currentUser();
  if (user) return true;
  const toast = inject(ToastrService);
  toast.error('You are not authorized to access this page', 'Error', {
    timeOut: 5000,
  });
  accountService.logout();
  return false;
};
