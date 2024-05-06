import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss'],
})
export class ProjectFilterComponent {
  @Output() filterChange = new EventEmitter<any>();
  selectedFilter: string;
  value: number = 0;
  highValue: number = 100;
  options: any = {
    floor: 0,
    ceil: 100,
    step: 1
  };

  filterOptions = [
    { value: '', label: 'Select Filter' },
    { value: 'mostLikes', label: 'Most Likes' },
    { value: 'topPositiveComments', label: 'Top Positive Comments' },
  ];

  constructor() { }

  onFilterChange(event: any) {
    console.log('Selected Filter:', event.value);
    this.filterChange.emit({ type: 'general', value: event.value });
  }

  onPriceChange(event: any) {
    const priceRange = { min: event.value, max: event.highValue };
    console.log('Price range:', priceRange);
    this.filterChange.emit({ type: 'price', value: priceRange });
  }

  toggleAdditionalFilter(filterType: string) {
    console.log('Additional filter:', filterType);
    this.filterChange.emit({ type: 'checkbox', value: filterType });
  }
}
