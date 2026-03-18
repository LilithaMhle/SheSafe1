import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit, OnDestroy {

  /** Drives the [style.width.%] binding on the loader bar (0 → 100) */
  loadProgress: number = 0;

  private readonly DURATION_MS = 2800; // total splash duration in ms
  private readonly INTERVAL_MS = 30;   // tick every 30 ms
  private intervalRef: any;

  constructor(private router: Router, private zone: NgZone) { }

  ngOnInit() {
    this.startLoader();
  }

  private startLoader(): void {
    const step = (this.INTERVAL_MS / this.DURATION_MS) * 100;

    this.intervalRef = setInterval(() => {
      this.zone.run(() => {
        this.loadProgress += step;

        if (this.loadProgress >= 100) {
          this.loadProgress = 100;
          clearInterval(this.intervalRef);
          this.goToLogin();
        }
      });
    }, this.INTERVAL_MS);
  }

  private goToLogin(): void {
    // Brief pause so the user sees the bar fully filled before navigating
    setTimeout(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    }, 350);
  }

  ngOnDestroy(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

}
