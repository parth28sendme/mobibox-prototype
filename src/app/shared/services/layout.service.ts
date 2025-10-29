import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private squeezeSubject = new BehaviorSubject<boolean>(false);
  public squeeze$ = this.squeezeSubject.asObservable();

  get squeeze(): boolean {
    return this.squeezeSubject.value;
  }

  setSqueezeValue(value: boolean): void {
    this.squeezeSubject.next(value);
  }

  toggleSqueeze(): void {
    this.setSqueezeValue(!this.squeeze);
  }
}