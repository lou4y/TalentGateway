import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss'],
})
export class ProjectFilterComponent {
  @Output() filterChange = new EventEmitter<any>();

  // Ajoutez la propriété `filterOptions` avec des options de filtre appropriées
  filterOptions = [
    { value: '', label: 'Select Filter' },
    { value: 'mostLikes', label: 'Most Likes' },
    { value: 'topPositiveComments', label: 'Top Positive Comments' },
    { value: 'bestPrices', label: 'Best Prices' },
  ];

  // Initialisation du slider pour la plage de prix
  value: number = 40;
  highValue: number = 60;
  options = {
    floor: 0,
    ceil: 100,
    step: 1,
  };

  onFilterChange(filter: string) {
    console.log('Selected Filter:', filter); // Log du filtre sélectionné
    this.filterChange.emit({ type: 'general', value: filter });
  }

  onPriceChange(event: any) {
    const priceRange = { min: event.value, max: event.highValue };
    console.log('Price range:', priceRange); // Log de la fourchette de prix
    this.filterChange.emit({ type: 'price', value: priceRange });
  }

  toggleAdditionalFilter(filterType: string) {
    console.log('Additional filter:', filterType);
    this.filterChange.emit({ type: 'checkbox', value: filterType });
  }
}
