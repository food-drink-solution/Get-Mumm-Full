import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconSvgComponent } from './icon-svg.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconSvgComponent, TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center" role="status">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <app-icon-svg [name]="iconName" size="28" class="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{{ message }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() iconName = 'lucidePackage';
  @Input() title    = '';
  @Input() message  = '';
}
