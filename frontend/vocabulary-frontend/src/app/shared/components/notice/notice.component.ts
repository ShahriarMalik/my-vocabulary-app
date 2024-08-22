import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.css',
})
export class NoticeComponent implements OnInit {
  @Input() message: string = '';
  @Input() isError: boolean = false;

  ngOnInit() {}
}
