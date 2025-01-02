import { ElementRef, inject, Injectable, signal } from '@angular/core';
import { MolstarSelectionObj } from '../../helpers/molstar/molstar-helpers';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
import { ListSelectable, OverviewMolstarFacade } from './data-processing.facade';

type stateProperties =
  | 'isInactive'
  | 'lastScroll'
  | 'initialStateImgName'
  | 'currentListViewSelectionIdx'
  | 'currentListViewSelectionTemp'
  | 'imgName'
  // "currentListViewSelection" |
  | 'currentDomainResource'
  // "currentMolstarSelectionName" |
  | 'currentMolstarSelection';
// "molstarSelectionObjs" ;

@Injectable({
  providedIn: 'root',
})
export class OverviewStateManagementService {
  // this is a variable to save tabs states
  // some are loaded/used for the template variables above when a tab is switched
  // in function switchCurrentTab
  public currentTab = signal<string>('Assembly');
  public tabsStates = signal<{
    [key: string]: {
      isInactive: boolean;
      lastScroll: number;
      imgName: string;
      initialStateImgName: string;
      // currentListViewSelection: string;
      currentListViewSelectionIdx: number;
      currentListViewSelectionTemp?: ListSelectable;
      currentDomainResource?: string;
      // currentMolstarSelectionName: string | undefined;
      currentMolstarSelection: MolstarSelectionObj | undefined;
      // molstarSelectionObjs: MolstarSelectionObj[];
    };
  }>({
    Assembly: {
      isInactive: false,
      lastScroll: 0,
      imgName: '',
      initialStateImgName: '',
      // currentListViewSelection: 'No selection',
      currentListViewSelectionIdx: 0,
      currentListViewSelectionTemp: undefined,
      // currentMolstarSelectionName: undefined,
      currentMolstarSelection: undefined,
      // molstarSelectionObjs: [],
    },
    Macromolecules: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      initialStateImgName: '',
      // currentListViewSelection: 'No selection',
      currentListViewSelectionIdx: 0,
      currentListViewSelectionTemp: undefined,
      // currentMolstarSelectionName: undefined,
      currentMolstarSelection: undefined,
      // molstarSelectionObjs: [],
    },
    Ligands: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      initialStateImgName: '',
      // currentListViewSelection: 'No selection',
      currentListViewSelectionIdx: 0,
      currentListViewSelectionTemp: undefined,
      // currentMolstarSelectionName: undefined,
      currentMolstarSelection: undefined,
      // molstarSelectionObjs: [],
    },
    Domains: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      initialStateImgName: '',
      // currentListViewSelection: 'No selection',
      currentListViewSelectionIdx: 0,
      currentListViewSelectionTemp: undefined,
      // currentMolstarSelectionName: undefined,
      currentDomainResource: 'CATH',
      currentMolstarSelection: undefined,
      // molstarSelectionObjs: [],
    },
    Modifications: {
      isInactive: true,
      lastScroll: 0,
      imgName: '',
      initialStateImgName: '',
      // currentListViewSelection: 'No selection',
      currentListViewSelectionIdx: 0,
      currentListViewSelectionTemp: undefined,
      // currentMolstarSelectionName: undefined,
      currentMolstarSelection: undefined,
      // molstarSelectionObjs: [],
    },
  });

  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly molstarOverview = inject(MolstarOverviewForTopPage);
  public infoControls = signal<ElementRef | undefined>(undefined);

  public getStatePropertyOfTab(tabName: string, propertyName: string) {
    if (tabName === 'current') tabName = this.currentTab();
    return this.tabsStates()[tabName][propertyName as stateProperties];
  }

  public updateStatePropertyOfTab(tabName: string, propertyName: string, propertyValue: any) {
    if (tabName === 'current') tabName = this.currentTab();
    this.tabsStates.update((tabsStates) => ({
      ...tabsStates,
      [tabName]: {
        ...tabsStates[tabName], // Spread the existing state for the specified tab
        [propertyName]: propertyValue, // Dynamically update the property
      },
    }));
  }

  public async switchCurrentTab(newView: string) {
    if (this.tabsStates()[newView].isInactive) return;

    // save scroll of current tab
    const previousTab = this.currentTab();
    const lastScrollTop = this.infoControls()!.nativeElement.scrollTop;
    this.updateStatePropertyOfTab(previousTab, 'lastScroll', lastScrollTop);

    // load last state of new tab
    this.currentTab.set(newView);
    const tabToDisplay = this.currentTab();

    const currentMolstarSelection = this.tabsStates()[newView].currentMolstarSelection;

    // load image gallery saved image state for new tab
    const imgName = this.tabsStates()[tabToDisplay].imgName;
    await this.molstarOverview.loadImage(imgName);
    this.updateStatePropertyOfTab(this.currentTab(), 'imgName', imgName);

    // const currentTabSelection = this.tabsStates()[tabToDisplay].currentListViewSelection;
    // await this.configureMolstarDisplay(currentTabSelection, currentMolstarSelection);

    const currentTabSelection = this.tabsStates()[tabToDisplay].currentListViewSelectionTemp;
    await this.configureMolstarDisplayTemp(currentTabSelection, currentMolstarSelection);

    // load saved list scroll for new tab
    this.infoControls()!.nativeElement.scrollTo(0, this.tabsStates()[tabToDisplay].lastScroll);
  }

  public async switchTabListSelection(listViewItem: ListSelectable) {
    const tabName = this.currentTab();
    const currentTabSelection = this.tabsStates()[tabName].currentListViewSelectionTemp;

    let imgName = this.tabsStates()[tabName].initialStateImgName;
    if (currentTabSelection && currentTabSelection.id === listViewItem.id) {
      this.updateStatePropertyOfTab(tabName, 'currentListViewSelectionTemp', undefined);
      this.updateStatePropertyOfTab(tabName, 'currentMolstarSelection', undefined);
      // this.updateStatePropertyOfTab(tabName, 'molstarSelectionObjs', []);
    } else {
      this.updateStatePropertyOfTab(tabName, 'currentListViewSelectionTemp', listViewItem);
      this.updateStatePropertyOfTab(tabName, 'currentMolstarSelection', listViewItem.molstarNamedSelections[0].selection);
      // this.updateStatePropertyOfTab(tabName, 'molstarSelectionObjs', listViewItem.molstarNamedSelections.map((item) => item.selection));
      imgName = listViewItem.molstarGalleryImg;
    }
    await this.molstarOverview.loadImage(imgName);
    this.updateStatePropertyOfTab(this.currentTab(), 'imgName', imgName);

    const currentMolstarSelection = this.tabsStates()[tabName].currentMolstarSelection;
    await this.configureMolstarDisplayTemp(listViewItem, currentMolstarSelection);
  }

  async configureMolstarDisplayTemp(tabSelection: ListSelectable | undefined, currentMolstarSelection: MolstarSelectionObj | undefined) {
    const tabName = this.currentTab();
    // if tab is domains and something is selected, show the whole polymer
    if (tabName === 'Domains' && tabSelection) {
      await this.molstarOverview.showDomainsWholeAssembly();
    }
    // if tab is ligands and something is selected, show as sticks
    if (tabName === 'Ligands' && tabSelection) {
      const chemCompId = tabSelection.name.split(' - ')[1];
      await this.molstarOverview.showLigandsAsSticks(currentMolstarSelection!.entityId!, chemCompId, this.dataProcessing.colorsFromMolj());
    }
    // if tab is modifications and something is selected, show as sticks
    if (tabName === 'Modifications' && tabSelection) {
      await this.molstarOverview.showModificationsAsSticks(tabSelection.molstarGalleryImg, this.dataProcessing.colorsFromMolj());
    }

    // zoom to the saved molstar selection
    await this.switchMolstarZoomed(currentMolstarSelection);
  }

  // async loadImg(imgString: string) {
  //   if (imgString) {
  //     this.updateStatePropertyOfTab(this.currentTab(), 'imgName', imgString);
  //     await this.molstarOverview.galleryManager().load(imgString);
  //   }
  // }

  async switchMolstarZoomed(molstarSelection?: MolstarSelectionObj) {
    if (molstarSelection) {
      await this.molstarOverview.focusLoci(molstarSelection);
    } else {
      await this.molstarOverview.unfocusLoci();
    }
  }
}
