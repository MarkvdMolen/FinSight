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
  styleUrls: ['./category-selector.component.css']
})
export class CategorySelectorComponent {
  private categoriesService = inject(ClassificationService);

  // Parent → child
  @Input() set excludes(value: string[] | null | undefined) {
    this._excludes.set(value ?? []);
  }

  // Child → parent
  @Output() excludesChange = new EventEmitter<string[]>();

  // Interne signal als bron voor alle child-logica
  private _excludes = signal<string[]>([]);
  public excludesSig = this._excludes; 

  private emitEffect = effect(() => {
    this.excludesChange.emit(this._excludes());
  });

  // Data
  categories$: Observable<CategoriesMap> =
    this.categoriesService.getCategories().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

  private groupKeys$ = this.categories$.pipe(
    map(obj => Object.keys(obj).sort()),
    startWith([] as string[])
  );
  // geef initialValue om |undefined uit het type te halen
  groupKeys = toSignal<string[]>(this.groupKeys$);

  // UI state
  isOpen = signal(false);
  query  = signal('');

  // Afgeleiden
  filteredGroups = computed<string[]>(() => {
    const q = this.query().trim().toLowerCase();
    const keys = this.groupKeys() ?? []; // fallback
    return q ? keys.filter(k => k.toLowerCase().includes(q)) : keys;
  });


  private selectedSet = computed(() => new Set(this._excludes()));
  isGroupSelected = (key: string) => this.selectedSet().has(key);

  toggleGroup(key: string) {
    const set = new Set(this._excludes());
    set.has(key) ? set.delete(key) : set.add(key);
    this._excludes.set([...set]);
  }

  selectAllVisible() {
    const set = new Set(this._excludes());
    this.filteredGroups().forEach(k => set.add(k));
    this._excludes.set([...set]);
  }

  clearAll() {
    this._excludes.set([]);
  }
}
