import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClassificationService } from '@shared/services/classification.service';
import { Observable, shareReplay, map } from 'rxjs';

type CategoriesMap = Record<string, string[]>;

interface Option {
  group: string; // bv. "Supermarkt"
  label: string; // bv. "jumbo"
  value: string; // hier gelijk aan label
}

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.css'
})
export class CategorySelectorComponent {

  private categoriesService = inject(ClassificationService);

  // === Excludes die megaan naar endpoints ===
  excludes = signal<string[]>(['Overboeken', 'Betaalverzoek']);

  // === Categories ophalen (Record<string,string[]>) ===
  categories$: Observable<CategoriesMap> =
    this.categoriesService.getCategories().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // === FLAT opties maken en als signal beschikbaar maken ===
  private options$ = this.categories$.pipe(
    map(obj =>
      Object.entries(obj).flatMap(([group, items]) =>
        items.map(label => ({ group, label, value: label } as Option))
      )
    )
  );
  options = toSignal(this.options$, { initialValue: [] as Option[] }) as Signal<Option[]>;

  // === Dropdown state & helpers ===
  isOpen = signal(false);
  query  = signal('');

  private selectedSet = computed(() => new Set(this.excludes()));

  filteredOptions = computed(() => {
    const q = this.query().trim().toLowerCase();
    const opts = this.options();
    if (!q) return opts;
    return opts.filter(o =>
      o.label.toLowerCase().includes(q) || o.group.toLowerCase().includes(q)
    );
    });

      groups = computed(() => {
    const mapG = new Map<string, Option[]>();
    for (const o of this.filteredOptions()) {
      if (!mapG.has(o.group)) mapG.set(o.group, []);
      mapG.get(o.group)!.push(o);
    }
    return Array.from(mapG.entries()) as [string, Option[]][];
  });

  isSelected = (value: string) => this.selectedSet().has(value);

  toggle(value: string) {
    const set = new Set(this.excludes());
    set.has(value) ? set.delete(value) : set.add(value);
    this.excludes.set([...set]);
  }

  selectAllInGroup(group: string) {
    const set = new Set(this.excludes());
    const inGroup = this.options().filter(o => o.group === group).map(o => o.value);
    inGroup.forEach(v => set.add(v));
    this.excludes.set([...set]);
  }

  clearGroup(group: string) {
    const set = new Set(this.excludes());
    const inGroup = this.options().filter(o => o.group === group).map(o => o.value);
    inGroup.forEach(v => set.delete(v));
    this.excludes.set([...set]);
  }

  clearAll() {
    this.excludes.set([]);
  }


}
