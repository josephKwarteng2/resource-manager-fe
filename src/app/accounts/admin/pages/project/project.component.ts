import { Component } from '@angular/core';
import { ButtonNewComponent } from '../../../user/components/button-new/button-new.component';
import { ProjectCreationModalComponent } from '../../../../shared/components/modals/project-creation-modal/project-creation-modal.component';
import { ProjectTableComponent } from '../../components/project-table/project-table.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ButtonNewComponent,
    ProjectCreationModalComponent,
    ProjectTableComponent
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  projectCreationModalOpen = false;

  openProjectCreationModal() {
    this.projectCreationModalOpen = true;
  }

}
