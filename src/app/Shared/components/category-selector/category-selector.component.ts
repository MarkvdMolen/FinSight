import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClassificationService } from '@shared/services/classification.service';
import { Observable, shareReplay, map, startWith } from 'rxjs';

type CategoriesMap = Record<string, string[]>;

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.css']   // <-- array
})
export class CategorySelectorComponent {

  private categoriesService = inject(ClassificationService);

  // === Excludes die meegaan naar endpoints (keys van categorieën) ===
  excludes = signal<string[]>([]);

  // (Optioneel) initial value van parent
  @Input() set initialExcludes(v: string[] | null | undefined) {
    this.excludes.set(v ?? []);
  }

  // (Optioneel) emit naar parent wanneer excludes wijzigt
  @Output() excludesChange = new EventEmitter<string[]>();
  private emitEffect = effect(() => {
    this.excludesChange.emit(this.excludes());
  });

  // === Categories ophalen (Record<string,string[]>) ===
  categories$: Observable<CategoriesMap> =
    this.categoriesService.getCategories().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

  // Alle categorie-namen (keys) uit de API
  private groupKeys$ = this.categories$.pipe(
    map(obj => Object.keys(obj).sort()),
    startWith([] as string[]) // -> nooit undefined
  );

  // Signal met alle beschikbare categorie-keys
  groupKeys = toSignal(this.groupKeys$);

  // UI state
  isOpen = signal(false);
  query  = signal('');

  // Filter op basis van de query
  filteredGroups = computed<string[]>(() => {
    const q = this.query().trim().toLowerCase();
    const keys = this.groupKeys() ?? [];
    return q ? keys.filter(k => k.toLowerCase().includes(q)) : keys;
  });

  // Helpers
  private selectedSet = computed(() => new Set(this.excludes()));
  isGroupSelected = (key: string) => this.selectedSet().has(key);

  toggleGroup(key: string) {
    const set = new Set(this.excludes());
    set.has(key) ? set.delete(key) : set.add(key);
    this.excludes.set([...set]);
  }

  // Bulk
  selectAllVisible() {
    const set = new Set(this.excludes());
    (this.filteredGroups() ?? []).forEach(k => set.add(k));
    this.excludes.set([...set]);
  }
  clearAll() {
    this.excludes.set([]);
  }
}
