import { Component, OnInit } from '@angular/core';
import { ClientDetails } from '../../../../shared/interfaces/types';
import { ClientCreationModalService } from '../../services/client-creation-modal.service';
import { CommonModule } from '@angular/common';
import { ClientDetailsComponent } from '../../../../shared/components/modals/client-details/client-details.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [CommonModule, ClientDetailsComponent, PaginationComponent],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.css',
})
export class ClientTableComponent implements OnInit {
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  clients: ClientDetails[] = [];
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  totalClients: number = 0;

  constructor(
    private clientCreationModalService: ClientCreationModalService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.fetchClients();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchClients();
  }

  fetchClients(): void {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.clientCreationModalService.getClients().subscribe(
      (response: any) => {
        this.handleClientResponse(response, startIndex, endIndex);
      },
      error => {
        this.handleClientError(error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  private handleClientResponse(response: any, startIndex: number, endIndex: number): void {
    const clients = response.clients || response;
    if (Array.isArray(clients)) {
      this.clients = clients.slice(startIndex, endIndex) as ClientDetails[];
      this.totalClients = clients.length;
      this.totalPages = Math.ceil(clients.length / this.itemsPerPage);
    } else {
      this.handleError('Invalid response format for clients:', clients);
    }
  }

  private handleClientError(error: any): void {
    this.handleError('Error fetching clients:', error);
  }

  private handleError(message: string, errorDetails: any): void {
    console.error(message, errorDetails);

    this.errorMessage = 'An error occurred while fetching clients. Please try again later.';
  }

  openClientsDetails(client: ClientDetails): void {
    const modalRef = this.modalService.open(ClientDetailsComponent);
    modalRef.componentInstance.client = client;
  }
}
