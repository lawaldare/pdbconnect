import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractiveTablesComponent } from '../interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../details-dashboard/details-dashboard.component';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pdbc-domains-tab',
  imports: [CommonModule, InteractiveTablesComponent, DetailsDashboardComponent, NgxSkeletonLoaderModule],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent implements OnInit {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public readonly molstarResidueInfoLoaded = computed(() => this.compCommunication.molstarResidueInfoLoaded());
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());
  ngOnInit(): void {
    console.log('DomainsTabComponent initialized');
  }
}
