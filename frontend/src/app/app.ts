import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, RouterLink, RouterOutlet, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ReadAloud } from './read-aloud/read-aloud';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, FormsModule, ReadAloud],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  termSearch: string = "";

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.termSearch = this.router.parseUrl(this.router.url).queryParams['search'] ?? "";
      });
  }

  searchJob() {
    const term = this.termSearch.trim();
    this.router.navigate(['/'], {
      queryParams: term ? { search: term } : {}
    });
  }

  skipToContent(event : Event) {
    event.preventDefault();
    document.getElementById("content")?.focus();
  }
}
