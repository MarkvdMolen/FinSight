import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategories',
  standalone: true
})
export class FilterCategoriesPipe implements PipeTransform {
    /**
     * Filters category keys by a given search value.
     *
     * @param categories A record of category names mapped to tag lists.
     * @param searchValue The current filter input (free text).
     * @returns A filtered array of category names matching the search input.
     */
    transform(categories: Record<string, string[]>, searchValue: string): string[] {
        if (!categories) return [];
        if (!searchValue) return Object.keys(categories);

        const lowerSearch = searchValue.toLowerCase();

        return Object.keys(categories).filter(category =>
            category.toLowerCase().includes(lowerSearch)
        );
    }
}