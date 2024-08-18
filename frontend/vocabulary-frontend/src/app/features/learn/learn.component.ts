import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.css',
})
export class LearnComponent {
  isChildRouteActive: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.isChildRouteActive = this.route.firstChild !== null;
    });
  }
}
