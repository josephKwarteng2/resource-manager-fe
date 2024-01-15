import { DOCUMENT } from '@angular/common';
import {
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { DeleteModalComponent } from './delete-modal.component';

@Injectable({
  providedIn: 'root',
})
export class DeleteModalService {
  constructor(
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  open(viewContainerRef: ViewContainerRef) {
    const modalComponentRef = viewContainerRef.createComponent(
      DeleteModalComponent,
      {
        injector: this.injector,
      }
    );
    modalComponentRef.instance.deleteConfirmedEvent.subscribe(() =>
      this.deleteConfirmed(modalComponentRef)
    );
    modalComponentRef.instance.cancelEvent.subscribe(() =>
      this.cancelModal(modalComponentRef)
    );
    this.document.body.appendChild(modalComponentRef.location.nativeElement);

    return modalComponentRef;
  }

  deleteConfirmed(modalComponentRef: ComponentRef<DeleteModalComponent>) {
    this.destroyModal(modalComponentRef);
  }

  cancelModal(modalComponentRef: ComponentRef<DeleteModalComponent>) {
    this.destroyModal(modalComponentRef);
  }

  private destroyModal(modalComponentRef: ComponentRef<DeleteModalComponent>) {
    setTimeout(() => {
      modalComponentRef.destroy();
    }, 400);
  }
}
