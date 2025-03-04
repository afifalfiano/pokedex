import { CanActivateFn } from '@angular/router';

export const DetailGuard: CanActivateFn = (route, state) => {
  if (route.paramMap.get('id')) {
    return true;
  }

  return false;
  
};
