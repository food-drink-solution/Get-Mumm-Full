import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconSvgComponent } from './icon-svg.component';

@Component({
  selector: 'app-error-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconSvgComponent, TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center" role="alert">
      <div class="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-4">
        <app-icon-svg name="lucideAlertTriangle" size="28" class="text-red-500" />
      </div>
      <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {{ title || ('ERROR.TITLE' | translate) }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs">
        {{ message || ('ERROR.MSG' | translate) }}
      </p>
      @if (retryable) {
        <button class="btn-primary gap-2" (click)="retry.emit()">
          <app-icon-svg name="lucideRefreshCw" size="14" />
          {{ 'COMMON.TRY_AGAIN' | translate }}
        </button>
      }
    </div>
  `
})
export class ErrorStateComponent {
  @Input() title     = '';
  @Input() message   = '';
  @Input() retryable = true;
  @Output() retry    = new EventEmitter<void>();
}
