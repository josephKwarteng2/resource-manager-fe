import { DOCUMENT } from '@angular/common';
import {
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AssignModalComponent } from './assign-modal.component';
import { User } from '../../../types/types';

@Injectable({
  providedIn: 'root',
})
export class AssignModalService {
  constructor(
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  open(viewContainerRef: ViewContainerRef, options?: { user?: User }) {
    const modalComponentRef = viewContainerRef.createComponent(
      AssignModalComponent,
      {
        injector: this.injector,
      }
    );
    if (options?.user) {
      modalComponentRef.instance.user = options.user;
    }
    modalComponentRef.instance.closeAssignEvent.subscribe(() =>
      this.closeModal(modalComponentRef)
    );
    modalComponentRef.instance.submitEvent.subscribe(() =>
      this.submitModal(modalComponentRef)
    );
    this.document.body.appendChild(modalComponentRef.location.nativeElement);

    return modalComponentRef;
  }

  closeModal(modalComponentRef: ComponentRef<AssignModalComponent>) {
    /**
     * This timer is to make the modal fade out before destroying it
     */
    setTimeout(() => {
      modalComponentRef.destroy();
    }, 400);
  }

  submitModal(modalComponentRef: ComponentRef<AssignModalComponent>) {
    modalComponentRef.destroy();
  }
}
