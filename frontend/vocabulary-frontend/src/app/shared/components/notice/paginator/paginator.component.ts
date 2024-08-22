import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent {
  @Input() length: number = 0; // Total number of items
  @Input() pageSize: number = 4; // Number of items per page
  @Input() pageSizeOptions: number[] = [4, 8, 12, 16, 20]; // Available page size options

  @Output() pageChange = new EventEmitter<number>(); // Emit the current page index
  @Output() pageSizeChange = new EventEmitter<number>(); // Emit the page size

  currentPage: number = 0; // Current page index

  ngOnInit() {}

  get totalPages(): number {
    return Math.ceil(this.length / this.pageSize);
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = parseInt(target.value, 10);
    this.currentPage = 0;
    this.pageSizeChange.emit(this.pageSize);
    this.pageChange.emit(this.currentPage);
  }
}
